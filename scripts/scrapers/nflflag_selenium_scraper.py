"""
NFL FLAG Selenium Scraper
=========================
Comprehensive scraper for NFL FLAG leagues using Selenium

Features:
- Search by ZIP code, city, or state
- Handle dynamic JavaScript content
- Extract all league details
- Export to Supabase-ready format

Usage:
    python nflflag_selenium_scraper.py --zip 90210
    python nflflag_selenium_scraper.py --city "Los Angeles" --state CA
    python nflflag_selenium_scraper.py --state CA --all
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import logging
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import argparse

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
OUTPUT_DIR = Path('../../scraped_data/raw')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class NFLFlagSeleniumScraper:
    """Selenium-based scraper for NFL FLAG leagues"""
    
    def __init__(self, headless: bool = True):
        """Initialize Selenium WebDriver"""
        chrome_options = Options()
        
        if headless:
            chrome_options.add_argument('--headless=new')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-software-rasterizer')
        chrome_options.add_argument('--disable-webgl')
        chrome_options.add_argument('--disable-3d-apis')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        
        # Disable WebGL entirely
        chrome_options.add_experimental_option('prefs', {
            'webgl.disabled': True
        })
        
        # Suppress WebGL error messages
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        # Automatically manage ChromeDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 15)
        
        self.base_url = "https://play.nflflag.com"
        logger.info("✅ Selenium WebDriver initialized")
    
    def __del__(self):
        """Clean up WebDriver"""
        if hasattr(self, 'driver'):
            try:
                self.driver.quit()
            except:
                pass
    
    def search_by_location(self, zip_code: str = None, city: str = None, state: str = None) -> List[str]:
        """
        Search for leagues by location and return league URLs
        
        NOTE: NFL FLAG's search primarily works with ZIP codes.
        If city/state provided, we'll use a default ZIP or skip search.
        
        Args:
            zip_code: ZIP code to search
            city: City name (limited support)
            state: State abbreviation
        
        Returns:
            List of league URLs found
        """
        logger.info("🔍 Loading NFL FLAG league finder...")
        
        # NFL FLAG search works best with ZIP codes
        if not zip_code:
            logger.warning("⚠️  NFL FLAG search works best with ZIP codes")
            if city and state:
                logger.info(f"💡 Tip: Instead of '{city}, {state}', try a ZIP code from that area")
            logger.info("⚠️  Skipping search - provide a ZIP code for best results")
            return []
        
        try:
            # Load the league finder page
            self.driver.get(self.base_url)
            time.sleep(3)  # Let page load
            
            logger.info(f"🔎 Searching for ZIP: {zip_code}")
            
            # Look for ZIP code input specifically
            zip_input = None
            zip_selectors = [
                'input[name="zipCode"]',
                'input[placeholder*="zip" i]',
                'input[type="text"]',
                '#zipCode',
                '.zip-input'
            ]
            
            for selector in zip_selectors:
                try:
                    zip_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if zip_input.is_displayed():
                        logger.info(f"✅ Found ZIP input: {selector}")
                        break
                except NoSuchElementException:
                    continue
            
            if not zip_input:
                logger.error("❌ Could not find ZIP code input")
                self.driver.save_screenshot('../../scraped_data/raw/nflflag_debug.png')
                logger.info("💾 Saved screenshot to: ../../scraped_data/raw/nflflag_debug.png")
                return []
            
            # Enter ZIP code
            zip_input.clear()
            zip_input.send_keys(zip_code)
            time.sleep(1)
            
            # Press Enter to search
            zip_input.send_keys(Keys.RETURN)
            
            logger.info("⏳ Waiting for results to load...")
            time.sleep(5)  # Wait for results
            
            # WebGL error is expected and harmless - ignore it
            logger.info("ℹ️  Ignoring WebGL errors (map feature) - extracting text data instead")
            
            # Take screenshot of results
            self.driver.save_screenshot('../../scraped_data/raw/nflflag_results.png')
            logger.info("💾 Saved results screenshot")
            
            # Extract league links
            league_urls = set()
            
            # Try to find league links
            link_selectors = [
                'a[href*="league"]',
                'a[href*="detail"]',
                '.league-link',
                '.result a',
                '[data-league]'
            ]
            
            for selector in link_selectors:
                try:
                    links = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for link in links:
                        href = link.get_attribute('href')
                        if href and ('league' in href.lower() or 'detail' in href.lower()):
                            league_urls.add(href)
                except:
                    continue
            
            # Also try to get all visible links
            if not league_urls:
                logger.info("🔍 Trying to find any links on the page...")
                all_links = self.driver.find_elements(By.TAG_NAME, 'a')
                for link in all_links:
                    try:
                        href = link.get_attribute('href')
                        text = link.text.strip()
                        if href and link.is_displayed():
                            logger.info(f"   Found link: {text[:50]} -> {href[:80]}")
                            if 'league' in href.lower() or 'detail' in href.lower():
                                league_urls.add(href)
                    except:
                        continue
            
            league_urls = sorted(list(league_urls))
            logger.info(f"✅ Found {len(league_urls)} league URLs")
            
            return league_urls
            
        except Exception as e:
            logger.error(f"❌ Error searching: {e}")
            self.driver.save_screenshot('../../scraped_data/raw/nflflag_error.png')
            logger.info("💾 Saved error screenshot")
            return []
    
    def scrape_league_page(self, url: str) -> Optional[Dict]:
        """
        Scrape details from a single league page
        
        Args:
            url: League page URL
        
        Returns:
            Dictionary of league data
        """
        logger.info(f"🔍 Scraping: {url}")
        
        try:
            self.driver.get(url)
            time.sleep(3)
            
            # Extract league name
            name = None
            name_selectors = ['h1', '.league-name', '[data-league-name]', '.title']
            for selector in name_selectors:
                try:
                    elem = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if elem.text.strip():
                        name = elem.text.strip()
                        break
                except:
                    continue
            
            if not name:
                logger.warning(f"⚠️  Could not find league name for {url}")
                return None
            
            # Get page text for parsing
            page_text = self.driver.find_element(By.TAG_NAME, 'body').text
            
            # Extract location
            city, state = self.extract_location(page_text)
            
            # Extract other details
            age_groups = self.extract_age_groups(page_text)
            season_info = self.extract_season(page_text)
            contact_info = self.extract_contact(page_text)
            
            # Build league data
            league = {
                'name': name,
                'city': city,
                'state': state,
                'website': url,
                'source': 'nflflag.com',
                'formats': ['5v5'],  # NFL FLAG typically uses 5v5
                'contact_type': 'non-contact',
                'comp_levels': ['rec', 'competitive'],
                'divisions': age_groups,
                'season_start': season_info.get('start'),
                'season_end': season_info.get('end'),
                'contact_email': contact_info.get('email'),
                'contact_phone': contact_info.get('phone'),
                'about': self.extract_description(page_text),
                'league_type': 'youth',
                'organization': 'NFL FLAG'
            }
            
            logger.info(f"✅ Scraped: {name} in {city}, {state}")
            return league
            
        except Exception as e:
            logger.error(f"❌ Error scraping {url}: {e}")
            return None
    
    def extract_location(self, text: str) -> tuple:
        """Extract city and state from text"""
        # Pattern: City, ST
        pattern = r'([A-Z][a-zA-Z\s]+),\s*([A-Z]{2})\b'
        matches = re.findall(pattern, text)
        
        if matches:
            # Return the first match that looks like a city, state pair
            for city, state in matches:
                city = city.strip()
                if len(city) > 2 and state.isupper():
                    return city, state
        
        return None, None
    
    def extract_age_groups(self, text: str) -> List[str]:
        """Extract age groups/divisions"""
        age_groups = []
        
        # Look for patterns like "5U", "8U", etc.
        divisions = re.findall(r'\b(\d+U)\b', text)
        age_groups.extend(divisions)
        
        # Look for age ranges like "ages 5-12"
        age_range = re.search(r'ages?\s+(\d+)\s*[-to]+\s*(\d+)', text, re.IGNORECASE)
        if age_range:
            start = int(age_range.group(1))
            end = int(age_range.group(2))
            for age in range(start, end + 1, 2):
                age_groups.append(f"{age}U")
        
        return sorted(list(set(age_groups))) if age_groups else ['6U', '8U', '10U', '12U', '14U']
    
    def extract_season(self, text: str) -> Dict:
        """Extract season dates"""
        season_info = {'start': None, 'end': None}
        
        # Look for season keywords
        seasons = {
            'spring': ('03-01', '05-31'),
            'summer': ('06-01', '08-31'),
            'fall': ('09-01', '11-30'),
            'winter': ('12-01', '02-28')
        }
        
        text_lower = text.lower()
        for season, (start, end) in seasons.items():
            if season in text_lower:
                year = datetime.now().year
                season_info['start'] = f"{year}-{start}"
                season_info['end'] = f"{year}-{end}"
                break
        
        return season_info
    
    def extract_contact(self, text: str) -> Dict:
        """Extract contact information"""
        contact = {'email': None, 'phone': None}
        
        # Email pattern
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if email_match:
            contact['email'] = email_match.group(0)
        
        # Phone pattern
        phone_match = re.search(r'\b(?:\d{3}[-.]?)?\d{3}[-.]?\d{4}\b', text)
        if phone_match:
            contact['phone'] = phone_match.group(0)
        
        return contact
    
    def extract_description(self, text: str) -> str:
        """Extract description/about text"""
        # Get first few sentences that look like a description
        sentences = text.split('.')
        description_parts = []
        
        for sentence in sentences[:5]:
            sentence = sentence.strip()
            if len(sentence) > 30 and 'flag football' in sentence.lower():
                description_parts.append(sentence)
        
        description = '. '.join(description_parts[:3])
        return description[:500] if description else None
    
    def save_results(self, leagues: List[Dict], output_prefix: str):
        """Save scraped leagues to file"""
        if not leagues:
            logger.warning("⚠️  No leagues to save")
            return
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save as JSON
        json_file = OUTPUT_DIR / f'{output_prefix}_{timestamp}_leagues.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(leagues, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 Saved {len(leagues)} leagues to {json_file}")
        
        return json_file


def main():
    """Main execution"""
    parser = argparse.ArgumentParser(
        description='Scrape NFL FLAG leagues using Selenium'
    )
    parser.add_argument('--zip', help='ZIP code to search')
    parser.add_argument('--city', help='City name')
    parser.add_argument('--state', help='State abbreviation (e.g., CA)')
    parser.add_argument('--output', default='nflflag', help='Output filename prefix')
    parser.add_argument('--headless', action='store_true', help='Run in headless mode')
    parser.add_argument('--debug', action='store_true', help='Save debug screenshots')
    
    args = parser.parse_args()
    
    logger.info("="*70)
    logger.info("NFL FLAG SELENIUM SCRAPER")
    logger.info("="*70)
    
    # Validate inputs - NFL FLAG needs ZIP codes
    if not args.zip:
        logger.error("❌ NFL FLAG search requires a ZIP code")
        logger.info("\n💡 Usage:")
        logger.info("   python nflflag_selenium_scraper.py --zip 90210")
        logger.info("   python nflflag_selenium_scraper.py --zip 10001")
        logger.info("\n⚠️  City/state search is not reliable for NFL FLAG")
        logger.info("   Find ZIP codes for your target area and search by ZIP")
        return
    
    # Initialize scraper
    scraper = NFLFlagSeleniumScraper(headless=args.headless)
    
    try:
        # Search for leagues
        logger.info("\n🔍 Searching for leagues...")
        league_urls = scraper.search_by_location(
            zip_code=args.zip,
            city=args.city,
            state=args.state
        )
        
        if not league_urls:
            logger.warning("⚠️  No league URLs found")
            logger.info("\n💡 Tips:")
            logger.info("   1. Check the screenshots in scraped_data/raw/")
            logger.info("   2. Try running without --headless to see what's happening")
            logger.info("   3. The site structure may have changed")
            return
        
        # Save URLs
        urls_file = OUTPUT_DIR / f'{args.output}_urls.txt'
        with open(urls_file, 'w') as f:
            f.write('\n'.join(league_urls))
        logger.info(f"💾 Saved URLs to {urls_file}")
        
        # Scrape each league
        logger.info(f"\n📥 Scraping {len(league_urls)} leagues...")
        leagues = []
        
        for i, url in enumerate(league_urls, 1):
            logger.info(f"\n[{i}/{len(league_urls)}] Scraping league...")
            league = scraper.scrape_league_page(url)
            if league:
                leagues.append(league)
            time.sleep(2)  # Be respectful
        
        # Save results
        if leagues:
            output_file = scraper.save_results(leagues, args.output)
            
            logger.info("\n" + "="*70)
            logger.info("✅ SCRAPING COMPLETE!")
            logger.info("="*70)
            logger.info(f"\nScraped {len(leagues)} leagues from NFL FLAG")
            logger.info(f"\n📊 Results saved to: {output_file}")
            logger.info("\n🎯 Next steps:")
            logger.info("   1. Review the output file")
            logger.info("   2. Import to database:")
            logger.info(f"      python import_to_supabase.py --file {output_file} --type leagues --dry-run")
        else:
            logger.warning("\n⚠️  No leagues were successfully scraped")
            logger.info("Check the screenshots for debugging")
        
    finally:
        # Cleanup
        del scraper


if __name__ == '__main__':
    main()