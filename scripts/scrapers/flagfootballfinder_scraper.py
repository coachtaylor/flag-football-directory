"""
Flag Football Finder Scraper
============================
Custom scraper for https://www.flagfootballfinder.com/

This site has individual league pages we need to scrape.
Examples:
- https://www.flagfootballfinder.com/leagues/elon-park-i9-sports-flag-football-league
- https://www.flagfootballfinder.com/leagues/acacia-elementary-school-i9-sports-flag-football-league

Usage:
    python flagfootballfinder_scraper.py --output fff_leagues
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
BASE_URL = "https://www.flagfootballfinder.com"
OUTPUT_DIR = Path('../../scraped_data/raw')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

class FlagFootballFinderScraper:
    """Scraper for flagfootballfinder.com"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'FlagFootballDirectory/1.0 (Educational purposes)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        })
        self.delay = 2  # Seconds between requests
        
    def get_page(self, url: str):
        """Fetch a page with error handling"""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            time.sleep(self.delay)
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def extract_location(self, text: str) -> tuple:
        """Extract city and state from text"""
        # Common patterns: "in City, ST" or "City, ST"
        pattern = r'(?:in\s+)?([A-Za-z\s]+),\s*([A-Z]{2})'
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip(), match.group(2).strip()
        return None, None
    
    def extract_age_groups(self, text: str) -> List[str]:
        """Extract age groups from text"""
        # Patterns: "ages 5-12", "5U to 12U", "6-14"
        age_groups = []
        
        # Pattern 1: ages X to Y, ages X-Y
        match = re.search(r'ages?\s+(\d+)\s*(?:to|-)\s*(\d+)', text, re.IGNORECASE)
        if match:
            start = int(match.group(1))
            end = int(match.group(2))
            age_groups = [f"{age}U" for age in range(start, end + 1, 2)]
        
        # Pattern 2: specific divisions like "5U", "8U"
        divisions = re.findall(r'\b(\d+U)\b', text)
        if divisions:
            age_groups.extend(divisions)
        
        return list(set(age_groups)) if age_groups else []
    
    def extract_formats(self, text: str) -> List[str]:
        """Extract game formats from text"""
        formats = []
        if '5v5' in text.lower() or '5 v 5' in text.lower():
            formats.append('5v5')
        if '7v7' in text.lower() or '7 v 7' in text.lower():
            formats.append('7v7')
        return formats
    
    def scrape_league_page(self, url: str) -> Dict:
        """Scrape a single league page"""
        soup = self.get_page(url)
        if not soup:
            return None
        
        try:
            # Extract league name (usually in h1 or title)
            name_elem = soup.find('h1')
            name = name_elem.text.strip() if name_elem else None
            
            if not name:
                # Try getting from title
                title = soup.find('title')
                if title:
                    name = title.text.split('|')[0].strip()
            
            if not name:
                logger.warning(f"No name found for {url}")
                return None
            
            # Get full text content
            text = soup.get_text()
            
            # Extract location
            city, state = self.extract_location(text)
            
            if not city or not state:
                logger.warning(f"No location found for {name}")
                return None
            
            # Extract age groups/divisions
            divisions = self.extract_age_groups(text)
            
            # Extract formats
            formats = self.extract_formats(text)
            
            # Extract season info
            season_start = None
            season_end = None
            
            # Look for season dates
            season_match = re.search(r'(spring|summer|fall|winter)\s+(?:season)?', text, re.IGNORECASE)
            if season_match:
                season = season_match.group(1).lower()
                # Map to approximate dates
                season_dates = {
                    'spring': ('03-01', '05-31'),
                    'summer': ('06-01', '08-31'),
                    'fall': ('09-01', '11-30'),
                    'winter': ('12-01', '02-28')
                }
                if season in season_dates:
                    year = datetime.now().year
                    season_start = f"{year}-{season_dates[season][0]}"
                    season_end = f"{year}-{season_dates[season][1]}"
            
            # Look for contact email
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            email_match = re.search(email_pattern, text)
            contact_email = email_match.group(0) if email_match else None
            
            # Extract about/description
            about = None
            # Look for description paragraphs
            desc_elem = soup.find('p')
            if desc_elem:
                about = desc_elem.text.strip()[:500]  # First 500 chars
            
            # Build league data
            league = {
                'name': name,
                'city': city,
                'state': state,
                'website': url,
                'divisions': divisions,
                'formats': formats if formats else ['7v7'],  # Default to 7v7
                'contact_type': 'non-contact',
                'comp_levels': ['rec'],  # Default to recreational
                'season_start': season_start,
                'season_end': season_end,
                'contact_email': contact_email,
                'about': about,
                'source': 'flagfootballfinder.com'
            }
            
            logger.info(f"✅ Scraped: {name} in {city}, {state}")
            return league
            
        except Exception as e:
            logger.error(f"Error parsing league page {url}: {e}")
            return None
    
    def scrape_known_leagues(self) -> List[Dict]:
        """
        Scrape known league URLs
        
        Note: This site appears to be dynamically loaded, so we'll need
        to either:
        1. Manually collect league URLs from the site
        2. Use Selenium to handle the dynamic content
        3. Look for a sitemap or API
        
        For now, let's start with a few example URLs
        """
        
        # Example league URLs found from search
        example_urls = [
            'https://www.flagfootballfinder.com/leagues/elon-park-i9-sports-flag-football-league',
            'https://www.flagfootballfinder.com/leagues/acacia-elementary-school-i9-sports-flag-football-league',
            'https://www.flagfootballfinder.com/leagues/norristown-eagleville-i9-sports-flag-football-league',
        ]
        
        leagues = []
        for url in example_urls:
            league = self.scrape_league_page(url)
            if league:
                leagues.append(league)
        
        return leagues
    
    def save_results(self, leagues: List[Dict], output_prefix: str):
        """Save scraped data to files"""
        if not leagues:
            logger.warning("No leagues to save")
            return
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save as JSON
        json_file = OUTPUT_DIR / f'{output_prefix}_{timestamp}_leagues.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(leagues, f, indent=2, ensure_ascii=False)
        logger.info(f"💾 Saved {len(leagues)} leagues to {json_file}")
        
        # Save in Supabase-ready format
        supabase_file = OUTPUT_DIR / f'{output_prefix}_{timestamp}_leagues_supabase.json'
        with open(supabase_file, 'w', encoding='utf-8') as f:
            json.dump(leagues, f, indent=2, ensure_ascii=False)
        logger.info(f"💾 Saved Supabase format to {supabase_file}")


def main():
    """Main scraper execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape flagfootballfinder.com')
    parser.add_argument('--output', default='flagfootballfinder', help='Output filename prefix')
    parser.add_argument('--urls', nargs='+', help='Specific league URLs to scrape')
    parser.add_argument('--urls-file', help='File containing URLs (one per line)')
    
    args = parser.parse_args()
    
    logger.info("="*60)
    logger.info("FLAG FOOTBALL FINDER SCRAPER")
    logger.info("="*60)
    
    scraper = FlagFootballFinderScraper()
    
    # Collect URLs to scrape
    urls_to_scrape = []
    
    if args.urls_file:
        # Read URLs from file
        logger.info(f"Reading URLs from {args.urls_file}...")
        with open(args.urls_file, 'r') as f:
            urls_to_scrape = [line.strip() for line in f if line.strip()]
        logger.info(f"Found {len(urls_to_scrape)} URLs in file")
    elif args.urls:
        # Use URLs provided as arguments
        urls_to_scrape = args.urls
        logger.info(f"Scraping {len(urls_to_scrape)} URLs from arguments")
    else:
        # Use default example URLs
        logger.info("No URLs provided, using example URLs...")
        urls_to_scrape = None
    
    # Scrape the URLs
    if urls_to_scrape:
        leagues = []
        for url in urls_to_scrape:
            league = scraper.scrape_league_page(url)
            if league:
                leagues.append(league)
    else:
        # Scrape known example leagues
        leagues = scraper.scrape_known_leagues()
    
    # Save results
    scraper.save_results(leagues, args.output)
    
    logger.info("="*60)
    logger.info(f"✅ Scraping complete! Found {len(leagues)} leagues")
    logger.info("="*60)
    logger.info("\nNext steps:")
    logger.info("1. Review the output file")
    logger.info("2. Import to database:")
    logger.info(f"   python import_to_supabase.py --file ../../scraped_data/raw/{args.output}_*_leagues.json --type leagues --dry-run")


if __name__ == '__main__':
    main()