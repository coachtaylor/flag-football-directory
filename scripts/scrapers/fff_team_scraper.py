"""
Flag Football Finder - Team Scraper
===================================
Scrape team data from flagfootballfinder.com

Usage:
    python fff_team_scraper.py --urls "URL1" "URL2"
    python fff_team_scraper.py --urls-file fff_team_urls.txt
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
OUTPUT_DIR = Path('../../scraped_data/raw')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class FFFTeamScraper:
    """Scraper for team pages on flagfootballfinder.com"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'FlagFootballDirectory/1.0 (Educational purposes)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        })
        self.delay = 2
        
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
        pattern = r'(?:in\s+)?([A-Za-z\s]+),\s*([A-Z]{2})'
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip(), match.group(2).strip()
        return None, None
    
    def extract_age_groups(self, text: str) -> List[str]:
        """Extract age groups from text"""
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
        return formats if formats else ['7v7']  # Default
    
    def extract_gender(self, text: str) -> str:
        """Extract gender from text"""
        text_lower = text.lower()
        
        if 'all-girls' in text_lower or 'girls only' in text_lower or 'girls-only' in text_lower:
            return 'F'
        elif 'boys only' in text_lower or 'boys-only' in text_lower:
            return 'M'
        elif 'co-ed' in text_lower or 'coed' in text_lower or 'mixed' in text_lower:
            return 'coed'
        
        return 'coed'  # Default
    
    def extract_comp_level(self, text: str) -> List[str]:
        """Extract competitive level from text"""
        text_lower = text.lower()
        levels = []
        
        if 'competitive' in text_lower or 'elite' in text_lower or 'travel' in text_lower:
            levels.append('competitive')
        if 'recreational' in text_lower or 'beginner' in text_lower:
            levels.append('rec')
        
        return levels if levels else ['rec']  # Default to recreational
    
    def scrape_team_page(self, url: str) -> Dict:
        """Scrape a single team page"""
        soup = self.get_page(url)
        if not soup:
            return None
        
        try:
            # Extract team name
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
            
            # Extract age groups
            age_groups = self.extract_age_groups(text)
            
            # Extract formats
            formats = self.extract_formats(text)
            
            # Extract gender
            gender = self.extract_gender(text)
            
            # Extract competitive level
            comp_levels = self.extract_comp_level(text)
            
            # Look for contact email
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            email_match = re.search(email_pattern, text)
            contact_email = email_match.group(0) if email_match else None
            
            # Extract about/description
            about = None
            desc_elem = soup.find('p')
            if desc_elem:
                about = desc_elem.text.strip()[:500]  # First 500 chars
            
            # Build team data
            team = {
                'name': name,
                'city': city,
                'state': state,
                'gender': gender,
                'age_groups': age_groups,
                'formats': formats,
                'comp_levels': comp_levels,
                'contact_type': 'non-contact',
                'website': url,
                'contact_email': contact_email,
                'about': about,
                'source': 'flagfootballfinder.com'
            }
            
            logger.info(f"✅ Scraped team: {name} in {city}, {state}")
            return team
            
        except Exception as e:
            logger.error(f"Error parsing team page {url}: {e}")
            return None
    
    def save_results(self, teams: List[Dict], output_prefix: str):
        """Save scraped data to files"""
        if not teams:
            logger.warning("No teams to save")
            return
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save as JSON
        json_file = OUTPUT_DIR / f'{output_prefix}_{timestamp}_teams.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(teams, f, indent=2, ensure_ascii=False)
        logger.info(f"💾 Saved {len(teams)} teams to {json_file}")
        
        # Save in Supabase-ready format
        supabase_file = OUTPUT_DIR / f'{output_prefix}_{timestamp}_teams_supabase.json'
        with open(supabase_file, 'w', encoding='utf-8') as f:
            json.dump(teams, f, indent=2, ensure_ascii=False)
        logger.info(f"💾 Saved Supabase format to {supabase_file}")


def main():
    """Main scraper execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape teams from flagfootballfinder.com')
    parser.add_argument('--output', default='flagfootballfinder_teams', help='Output filename prefix')
    parser.add_argument('--urls', nargs='+', help='Specific team URLs to scrape')
    parser.add_argument('--urls-file', help='File containing team URLs (one per line)')
    
    args = parser.parse_args()
    
    logger.info("="*60)
    logger.info("FLAG FOOTBALL FINDER - TEAM SCRAPER")
    logger.info("="*60)
    
    scraper = FFFTeamScraper()
    
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
        logger.error("No URLs provided! Use --urls or --urls-file")
        return
    
    # Scrape the teams
    teams = []
    for url in urls_to_scrape:
        team = scraper.scrape_team_page(url)
        if team:
            teams.append(team)
    
    # Save results
    scraper.save_results(teams, args.output)
    
    logger.info("="*60)
    logger.info(f"✅ Scraping complete! Found {len(teams)} teams")
    logger.info("="*60)
    logger.info("\nNext steps:")
    logger.info("1. Review the output file")
    logger.info("2. Import to database:")
    logger.info(f"   python import_to_supabase.py --file ../../scraped_data/raw/{args.output}_*_teams.json --type teams --dry-run")


if __name__ == '__main__':
    main()