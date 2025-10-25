"""
Flag Football Directory - Web Scraper
=====================================
This script scrapes flag football programs from various sources and
prepares them for import into your database.

Dependencies:
    pip install requests beautifulsoup4 selenium webdriver-manager pandas python-dotenv

Usage:
    python scraper.py --source nflflag
    python scraper.py --source all
    python scraper.py --state CA --city "Los Angeles"
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import re
from datetime import datetime
from typing import List, Dict, Optional
import time
import logging
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class LeagueData:
    """Data structure for scraped league information"""
    name: str
    website: str
    city: str
    state: str
    fees: Optional[float] = None
    season_start: Optional[str] = None
    season_end: Optional[str] = None
    divisions: List[str] = None
    nights: List[str] = None
    formats: List[str] = None
    contact_type: Optional[str] = None
    comp_levels: List[str] = None
    signup_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    about: Optional[str] = None
    source: str = 'scraped'
    
    def __post_init__(self):
        if self.divisions is None:
            self.divisions = []
        if self.nights is None:
            self.nights = []
        if self.formats is None:
            self.formats = []
        if self.comp_levels is None:
            self.comp_levels = []


@dataclass
class EventData:
    """Data structure for scraped event information"""
    name: str
    kind: str  # 'clinic' or 'tournament'
    state: str
    location: str
    start_date: str
    website: str
    end_date: Optional[str] = None
    fee: Optional[float] = None
    divisions: List[str] = None
    formats: List[str] = None
    contact_type: Optional[str] = None
    comp_levels: List[str] = None
    signup_url: Optional[str] = None
    contact_email: Optional[str] = None
    about: Optional[str] = None
    source: str = 'scraped'
    
    def __post_init__(self):
        if self.divisions is None:
            self.divisions = []
        if self.formats is None:
            self.formats = []
        if self.comp_levels is None:
            self.comp_levels = []


class BaseScraper:
    """Base class for all scrapers"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.delay = 2  # Seconds between requests (be respectful!)
    
    def get_page(self, url: str, retries: int = 3) -> Optional[BeautifulSoup]:
        """Fetch and parse a web page"""
        for attempt in range(retries):
            try:
                logger.info(f"Fetching: {url}")
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                time.sleep(self.delay)
                return BeautifulSoup(response.content, 'html.parser')
            except requests.RequestException as e:
                logger.error(f"Error fetching {url}: {e}")
                if attempt < retries - 1:
                    time.sleep(5)
                    continue
                return None
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        match = re.search(phone_pattern, text)
        return match.group(0) if match else None
    
    def extract_price(self, text: str) -> Optional[float]:
        """Extract price from text"""
        price_pattern = r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)'
        match = re.search(price_pattern, text)
        if match:
            return float(match.group(1).replace(',', ''))
        return None
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return ' '.join(text.strip().split())


class NFLFlagScraper(BaseScraper):
    """Scraper for NFL FLAG leagues"""
    
    def __init__(self):
        super().__init__()
        self.base_url = "https://nflflag.com"
    
    def scrape_leagues(self, state: Optional[str] = None) -> List[LeagueData]:
        """
        Scrape NFL FLAG leagues
        
        NOTE: This is a template. NFL FLAG's actual site structure will vary.
        You'll need to inspect their site and adjust selectors accordingly.
        """
        leagues = []
        
        # Example: Scrape from a league directory page
        directory_url = f"{self.base_url}/find-a-league"
        soup = self.get_page(directory_url)
        
        if not soup:
            return leagues
        
        # Example selector - adjust based on actual site
        league_elements = soup.find_all('div', class_='league-card')
        
        for element in league_elements:
            try:
                league = LeagueData(
                    name=self.clean_text(element.find('h3').text),
                    website=self.base_url,
                    city=self.clean_text(element.find('span', class_='city').text),
                    state=self.clean_text(element.find('span', class_='state').text),
                    source='nflflag'
                )
                
                # Extract additional details if available
                details_link = element.find('a', href=True)
                if details_link:
                    detail_url = urljoin(self.base_url, details_link['href'])
                    self._scrape_league_details(detail_url, league)
                
                leagues.append(league)
                logger.info(f"Scraped: {league.name}")
                
            except Exception as e:
                logger.error(f"Error parsing league element: {e}")
                continue
        
        return leagues
    
    def _scrape_league_details(self, url: str, league: LeagueData):
        """Scrape detailed information from a league page"""
        soup = self.get_page(url)
        if not soup:
            return
        
        # Example: Extract fees
        fee_text = soup.find('span', class_='price')
        if fee_text:
            league.fees = self.extract_price(fee_text.text)
        
        # Example: Extract divisions/age groups
        divisions_section = soup.find('div', class_='divisions')
        if divisions_section:
            league.divisions = [
                self.clean_text(div.text) 
                for div in divisions_section.find_all('span')
            ]
        
        # Extract contact info
        contact_section = soup.find('div', class_='contact')
        if contact_section:
            league.contact_email = self.extract_email(contact_section.text)
            league.contact_phone = self.extract_phone(contact_section.text)


class GenericLeagueScraper(BaseScraper):
    """Generic scraper for common league directory patterns"""
    
    def scrape_from_directory(self, url: str) -> List[LeagueData]:
        """
        Scrape leagues from a directory-style page
        
        This uses common patterns found on many league directory sites.
        """
        leagues = []
        soup = self.get_page(url)
        
        if not soup:
            return leagues
        
        # Common patterns for league listings
        selectors = [
            'div.league-item',
            'div.program-card',
            'article.league',
            'div[class*="league"]',
            'div[class*="program"]'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                logger.info(f"Found {len(elements)} items with selector: {selector}")
                
                for element in elements:
                    try:
                        league = self._parse_league_element(element, url)
                        if league:
                            leagues.append(league)
                    except Exception as e:
                        logger.error(f"Error parsing element: {e}")
                        continue
                break
        
        return leagues
    
    def _parse_league_element(self, element, base_url: str) -> Optional[LeagueData]:
        """Parse a league element using common patterns"""
        
        # Try to find name
        name = None
        for tag in ['h2', 'h3', 'h4', 'strong', 'a']:
            name_elem = element.find(tag)
            if name_elem and name_elem.text.strip():
                name = self.clean_text(name_elem.text)
                break
        
        if not name:
            return None
        
        # Try to find location
        location_text = element.get_text()
        city, state = self._extract_location(location_text)
        
        if not city or not state:
            return None
        
        # Find website/link
        link = element.find('a', href=True)
        website = urljoin(base_url, link['href']) if link else base_url
        
        league = LeagueData(
            name=name,
            website=website,
            city=city,
            state=state,
            source='generic_scraper'
        )
        
        # Extract additional info from text
        text = element.get_text()
        league.fees = self.extract_price(text)
        league.contact_email = self.extract_email(text)
        league.contact_phone = self.extract_phone(text)
        
        # Try to extract age groups
        age_pattern = r'\b(\d+U|ADULT)\b'
        league.divisions = list(set(re.findall(age_pattern, text, re.IGNORECASE)))
        
        return league
    
    def _extract_location(self, text: str) -> tuple:
        """Extract city and state from text"""
        # Common state abbreviations
        states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
                 'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                 'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
                 'VA','WA','WV','WI','WY','DC']
        
        # Pattern: City, ST
        pattern = r'([A-Za-z\s]+),\s*(' + '|'.join(states) + r')\b'
        match = re.search(pattern, text)
        
        if match:
            return match.group(1).strip(), match.group(2).strip()
        
        return None, None


class TournamentScraper(BaseScraper):
    """Scraper for tournament and clinic events"""
    
    def scrape_tournaments_from_directory(self, url: str) -> List[EventData]:
        """Scrape tournaments from a directory page"""
        events = []
        soup = self.get_page(url)
        
        if not soup:
            return events
        
        # Common patterns for event listings
        selectors = [
            'div.tournament-item',
            'div.event-card',
            'article.event',
            'div[class*="tournament"]',
            'div[class*="event"]'
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                logger.info(f"Found {len(elements)} events with selector: {selector}")
                
                for element in elements:
                    try:
                        event = self._parse_event_element(element, url)
                        if event:
                            events.append(event)
                    except Exception as e:
                        logger.error(f"Error parsing event: {e}")
                        continue
                break
        
        return events
    
    def _parse_event_element(self, element, base_url: str) -> Optional[EventData]:
        """Parse an event element"""
        
        # Find name
        name = None
        for tag in ['h2', 'h3', 'h4', 'strong']:
            name_elem = element.find(tag)
            if name_elem and name_elem.text.strip():
                name = self.clean_text(name_elem.text)
                break
        
        if not name:
            return None
        
        # Determine event type
        kind = 'tournament'  # default
        if any(word in name.lower() for word in ['clinic', 'camp', 'training', 'skills']):
            kind = 'clinic'
        
        text = element.get_text()
        
        # Extract location
        location, state = self._extract_location(text)
        if not location or not state:
            return None
        
        # Extract dates
        start_date, end_date = self._extract_dates(text)
        if not start_date:
            return None
        
        # Find website
        link = element.find('a', href=True)
        website = urljoin(base_url, link['href']) if link else base_url
        
        event = EventData(
            name=name,
            kind=kind,
            state=state,
            location=location,
            start_date=start_date,
            end_date=end_date,
            website=website,
            source='generic_scraper'
        )
        
        # Extract fee
        event.fee = self.extract_price(text)
        
        # Extract contact info
        event.contact_email = self.extract_email(text)
        
        # Extract age groups
        age_pattern = r'\b(\d+U|ADULT)\b'
        event.divisions = list(set(re.findall(age_pattern, text, re.IGNORECASE)))
        
        return event
    
    def _extract_location(self, text: str) -> tuple:
        """Extract location and state from text"""
        states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
                 'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
                 'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
                 'VA','WA','WV','WI','WY','DC']
        
        pattern = r'([A-Za-z\s]+),\s*(' + '|'.join(states) + r')\b'
        match = re.search(pattern, text)
        
        if match:
            return match.group(1).strip() + ', ' + match.group(2).strip(), match.group(2).strip()
        
        return None, None
    
    def _extract_dates(self, text: str) -> tuple:
        """Extract start and end dates from text"""
        # Common date patterns
        patterns = [
            r'(\d{1,2}/\d{1,2}/\d{4})',
            r'(\d{4}-\d{2}-\d{2})',
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}'
        ]
        
        dates = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                dates.extend(matches)
        
        if not dates:
            return None, None
        
        # Convert to YYYY-MM-DD format
        start_date = self._normalize_date(dates[0])
        end_date = self._normalize_date(dates[1]) if len(dates) > 1 else None
        
        return start_date, end_date
    
    def _normalize_date(self, date_str: str) -> Optional[str]:
        """Convert various date formats to YYYY-MM-DD"""
        formats = [
            '%m/%d/%Y',
            '%Y-%m-%d',
            '%B %d, %Y',
            '%B %d %Y'
        ]
        
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str, fmt)
                return dt.strftime('%Y-%m-%d')
            except ValueError:
                continue
        
        return None


class DataExporter:
    """Export scraped data to various formats"""
    
    @staticmethod
    def to_csv(data: List, filename: str):
        """Export data to CSV"""
        if not data:
            logger.warning("No data to export")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            dict_data = [asdict(item) for item in data]
            writer = csv.DictWriter(f, fieldnames=dict_data[0].keys())
            writer.writeheader()
            writer.writerows(dict_data)
        
        logger.info(f"Exported {len(data)} records to {filename}")
    
    @staticmethod
    def to_json(data: List, filename: str):
        """Export data to JSON"""
        if not data:
            logger.warning("No data to export")
            return
        
        dict_data = [asdict(item) for item in data]
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(dict_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported {len(data)} records to {filename}")
    
    @staticmethod
    def to_supabase_json(data: List, filename: str):
        """Export data in format ready for Supabase import"""
        if not data:
            logger.warning("No data to export")
            return
        
        # Convert to format matching your database schema
        formatted_data = []
        for item in data:
            item_dict = asdict(item)
            # Remove 'source' field if you don't have it in DB
            # item_dict.pop('source', None)
            formatted_data.append(item_dict)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Exported {len(data)} records to {filename} (Supabase format)")


# Example usage and main function
def main():
    """Main scraper execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape flag football programs')
    parser.add_argument('--source', choices=['nflflag', 'generic', 'tournament', 'all'], 
                       default='all', help='Source to scrape')
    parser.add_argument('--url', help='URL to scrape (for generic scraper)')
    parser.add_argument('--state', help='Filter by state')
    parser.add_argument('--output', default='scraped_data', help='Output filename prefix')
    
    args = parser.parse_args()
    
    all_leagues = []
    all_events = []
    
    # Scrape NFL FLAG leagues
    if args.source in ['nflflag', 'all']:
        logger.info("Scraping NFL FLAG leagues...")
        scraper = NFLFlagScraper()
        leagues = scraper.scrape_leagues(state=args.state)
        all_leagues.extend(leagues)
    
    # Scrape from generic URL
    if args.source == 'generic' and args.url:
        logger.info(f"Scraping from: {args.url}")
        scraper = GenericLeagueScraper()
        leagues = scraper.scrape_from_directory(args.url)
        all_leagues.extend(leagues)
    
    # Scrape tournaments
    if args.source in ['tournament', 'all'] and args.url:
        logger.info("Scraping tournaments/clinics...")
        scraper = TournamentScraper()
        events = scraper.scrape_tournaments_from_directory(args.url)
        all_events.extend(events)
    
    # Export results
    exporter = DataExporter()
    
    if all_leagues:
        exporter.to_csv(all_leagues, f'{args.output}_leagues.csv')
        exporter.to_json(all_leagues, f'{args.output}_leagues.json')
        exporter.to_supabase_json(all_leagues, f'{args.output}_leagues_supabase.json')
    
    if all_events:
        exporter.to_csv(all_events, f'{args.output}_events.csv')
        exporter.to_json(all_events, f'{args.output}_events.json')
        exporter.to_supabase_json(all_events, f'{args.output}_events_supabase.json')
    
    logger.info("Scraping complete!")
    logger.info(f"Total leagues: {len(all_leagues)}")
    logger.info(f"Total events: {len(all_events)}")


if __name__ == '__main__':
    main()