"""
Flag Football Finder - URL Discovery with Selenium
=================================================
Automatically discover all league and team URLs from flagfootballfinder.com

This script:
1. Loads the directory pages with Selenium (handles JavaScript)
2. Scrolls to load all content (handles infinite scroll/pagination)
3. Extracts all league and team URLs
4. Saves them to files for further scraping

Usage:
    python fff_url_discovery.py --type leagues
    python fff_url_discovery.py --type teams
    python fff_url_discovery.py --type all
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import logging
from pathlib import Path
from typing import List, Set
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


class FFFUrlDiscovery:
    """Discover all league and team URLs from Flag Football Finder"""
    
    def __init__(self, headless: bool = True):
        """Initialize Selenium WebDriver"""
        chrome_options = Options()
        
        if headless:
            chrome_options.add_argument('--headless=new')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        
        # Automatically manage ChromeDriver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)
        
        logger.info("✅ Selenium WebDriver initialized")
    
    def __del__(self):
        """Clean up WebDriver"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def scroll_to_load_all(self, pause_time: float = 2.0, max_scrolls: int = 50):
        """
        Scroll down to load all content (handles infinite scroll)
        
        Args:
            pause_time: Seconds to wait between scrolls
            max_scrolls: Maximum number of scroll attempts
        """
        logger.info("Scrolling to load all content...")
        
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        scrolls = 0
        
        while scrolls < max_scrolls:
            # Scroll to bottom
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(pause_time)
            
            # Calculate new scroll height
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            
            # Check if we've reached the bottom
            if new_height == last_height:
                logger.info(f"Reached bottom after {scrolls} scrolls")
                break
            
            last_height = new_height
            scrolls += 1
            
            if scrolls % 5 == 0:
                logger.info(f"Scrolled {scrolls} times...")
        
        logger.info("✅ Finished loading all content")
    
    def click_load_more_buttons(self, max_clicks: int = 20):
        """
        Click 'Load More' or 'Show More' buttons repeatedly
        
        Args:
            max_clicks: Maximum number of times to click
        """
        clicks = 0
        
        # Common load more button selectors
        button_selectors = [
            "button:contains('Load More')",
            "button:contains('Show More')",
            "a:contains('Load More')",
            ".load-more",
            "[data-load-more]",
        ]
        
        while clicks < max_clicks:
            button_found = False
            
            for selector in button_selectors:
                try:
                    # Try to find and click button
                    buttons = self.driver.find_elements(By.XPATH, f"//*[contains(text(), 'Load More') or contains(text(), 'Show More')]")
                    
                    if buttons:
                        button = buttons[0]
                        if button.is_displayed() and button.is_enabled():
                            button.click()
                            time.sleep(2)
                            clicks += 1
                            button_found = True
                            logger.info(f"Clicked 'Load More' button ({clicks} times)")
                            break
                except:
                    continue
            
            if not button_found:
                logger.info("No more 'Load More' buttons found")
                break
    
    def discover_league_urls(self) -> List[str]:
        """
        Discover all league URLs from the leagues directory
        
        Returns:
            List of unique league URLs
        """
        url = "https://www.flagfootballfinder.com/youth-flag-football-leagues"
        logger.info(f"🔍 Discovering league URLs from: {url}")
        
        try:
            # Load the page
            self.driver.get(url)
            logger.info("Page loaded, waiting for content...")
            
            # Wait for content to load
            time.sleep(3)
            
            # Scroll to load all content
            self.scroll_to_load_all(pause_time=2, max_scrolls=30)
            
            # Try to click any "Load More" buttons
            self.click_load_more_buttons(max_clicks=10)
            
            # Give it one more second to load
            time.sleep(2)
            
            # Extract all league links
            league_urls = set()
            
            # Find all links that contain '/leagues/'
            links = self.driver.find_elements(By.TAG_NAME, 'a')
            
            for link in links:
                try:
                    href = link.get_attribute('href')
                    if href and '/leagues/' in href and href not in league_urls:
                        # Clean URL (remove query params if any)
                        clean_url = href.split('?')[0].split('#')[0]
                        if clean_url.endswith('/leagues/') or len(clean_url.split('/leagues/')[1]) > 0:
                            league_urls.add(clean_url)
                except:
                    continue
            
            # Convert to sorted list
            league_urls = sorted(list(league_urls))
            
            logger.info(f"✅ Found {len(league_urls)} unique league URLs")
            return league_urls
            
        except Exception as e:
            logger.error(f"Error discovering league URLs: {e}")
            return []
    
    def discover_team_urls(self) -> List[str]:
        """
        Discover all team URLs from the teams directory
        
        Returns:
            List of unique team URLs
        """
        url = "https://www.flagfootballfinder.com/youth-flag-football-teams"
        logger.info(f"🔍 Discovering team URLs from: {url}")
        
        try:
            # Load the page
            self.driver.get(url)
            logger.info("Page loaded, waiting for content...")
            
            # Wait for content to load
            time.sleep(3)
            
            # Scroll to load all content
            self.scroll_to_load_all(pause_time=2, max_scrolls=30)
            
            # Try to click any "Load More" buttons
            self.click_load_more_buttons(max_clicks=10)
            
            # Give it one more second to load
            time.sleep(2)
            
            # Extract all team links
            team_urls = set()
            
            # Find all links that contain '/teams/'
            links = self.driver.find_elements(By.TAG_NAME, 'a')
            
            for link in links:
                try:
                    href = link.get_attribute('href')
                    if href and '/teams/' in href and href not in team_urls:
                        # Clean URL (remove query params if any)
                        clean_url = href.split('?')[0].split('#')[0]
                        if clean_url.endswith('/teams/') or len(clean_url.split('/teams/')[1]) > 0:
                            team_urls.add(clean_url)
                except:
                    continue
            
            # Convert to sorted list
            team_urls = sorted(list(team_urls))
            
            logger.info(f"✅ Found {len(team_urls)} unique team URLs")
            return team_urls
            
        except Exception as e:
            logger.error(f"Error discovering team URLs: {e}")
            return []
    
    def discover_organization_urls(self) -> List[str]:
        """
        Discover all organization URLs (clubs, academies, etc.)
        
        Returns:
            List of unique organization URLs
        """
        url = "https://www.flagfootballfinder.com"
        logger.info(f"🔍 Discovering organization URLs from: {url}")
        
        try:
            # Load the page
            self.driver.get(url)
            time.sleep(3)
            
            # Extract all organization links
            org_urls = set()
            
            # Find all links that contain '/organizations/'
            links = self.driver.find_elements(By.TAG_NAME, 'a')
            
            for link in links:
                try:
                    href = link.get_attribute('href')
                    if href and '/organizations/' in href and href not in org_urls:
                        clean_url = href.split('?')[0].split('#')[0]
                        org_urls.add(clean_url)
                except:
                    continue
            
            org_urls = sorted(list(org_urls))
            
            logger.info(f"✅ Found {len(org_urls)} unique organization URLs")
            return org_urls
            
        except Exception as e:
            logger.error(f"Error discovering organization URLs: {e}")
            return []
    
    def save_urls(self, urls: List[str], filename: str):
        """Save URLs to both text and JSON files"""
        if not urls:
            logger.warning("No URLs to save")
            return
        
        # Save as text file (one URL per line)
        txt_file = OUTPUT_DIR / f'{filename}.txt'
        with open(txt_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(urls))
        logger.info(f"💾 Saved {len(urls)} URLs to {txt_file}")
        
        # Save as JSON
        json_file = OUTPUT_DIR / f'{filename}.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({'urls': urls, 'count': len(urls)}, f, indent=2)
        logger.info(f"💾 Saved JSON to {json_file}")


def main():
    """Main execution"""
    parser = argparse.ArgumentParser(
        description='Discover all league/team URLs from Flag Football Finder'
    )
    parser.add_argument(
        '--type',
        choices=['leagues', 'teams', 'organizations', 'all'],
        default='all',
        help='Type of URLs to discover'
    )
    parser.add_argument(
        '--headless',
        action='store_true',
        help='Run browser in headless mode (no visible window)'
    )
    
    args = parser.parse_args()
    
    logger.info("="*70)
    logger.info("FLAG FOOTBALL FINDER - URL DISCOVERY")
    logger.info("="*70)
    
    # Initialize scraper
    discoverer = FFFUrlDiscovery(headless=args.headless)
    
    try:
        # Discover URLs based on type
        if args.type in ['leagues', 'all']:
            logger.info("\n" + "="*70)
            logger.info("DISCOVERING LEAGUE URLs")
            logger.info("="*70)
            league_urls = discoverer.discover_league_urls()
            discoverer.save_urls(league_urls, 'fff_league_urls')
        
        if args.type in ['teams', 'all']:
            logger.info("\n" + "="*70)
            logger.info("DISCOVERING TEAM URLs")
            logger.info("="*70)
            team_urls = discoverer.discover_team_urls()
            discoverer.save_urls(team_urls, 'fff_team_urls')
        
        if args.type in ['organizations', 'all']:
            logger.info("\n" + "="*70)
            logger.info("DISCOVERING ORGANIZATION URLs")
            logger.info("="*70)
            org_urls = discoverer.discover_organization_urls()
            discoverer.save_urls(org_urls, 'fff_organization_urls')
        
        logger.info("\n" + "="*70)
        logger.info("✅ URL DISCOVERY COMPLETE!")
        logger.info("="*70)
        
        # Print next steps
        logger.info("\nNEXT STEPS:")
        logger.info("-" * 70)
        
        if args.type in ['leagues', 'all']:
            logger.info("\n1. Review league URLs:")
            logger.info("   cat ../../scraped_data/raw/fff_league_urls.txt")
            logger.info("\n2. Scrape the leagues:")
            logger.info("   python flagfootballfinder_scraper.py --urls-file ../../scraped_data/raw/fff_league_urls.txt")
        
        if args.type in ['teams', 'all']:
            logger.info("\n3. Review team URLs:")
            logger.info("   cat ../../scraped_data/raw/fff_team_urls.txt")
            logger.info("\n4. Scrape the teams:")
            logger.info("   python fff_team_scraper.py --urls-file ../../scraped_data/raw/fff_team_urls.txt")
        
        logger.info("\n" + "="*70)
        
    finally:
        # Cleanup
        del discoverer


if __name__ == '__main__':
    main()