"""
Simple Test Scraper - Example Implementation
============================================
This is a working example that you can test and modify.

Usage:
    python test_scraper.py
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape_example_site():
    """
    Example scraper that demonstrates the basic pattern.
    
    Replace the URL and selectors with your target site.
    """
    
    # Example: Scraping a hypothetical league directory
    url = "https://example.com/leagues"  # Replace with actual URL
    
    print(f"Scraping: {url}")
    
    # Fetch the page
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching page: {e}")
        return []
    
    # Parse HTML
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all league items
    # IMPORTANT: Inspect your target site and replace these selectors!
    league_items = soup.find_all('div', class_='league-item')
    
    leagues = []
    
    for item in league_items:
        try:
            # Extract data from each league item
            # Adjust these selectors based on actual HTML structure
            
            league = {
                'name': item.find('h3').text.strip() if item.find('h3') else 'Unknown',
                'location': item.find('span', class_='location').text.strip() if item.find('span', class_='location') else '',
                'website': item.find('a')['href'] if item.find('a') else '',
                'scraped_at': datetime.now().isoformat()
            }
            
            leagues.append(league)
            print(f"Found: {league['name']}")
            
        except Exception as e:
            print(f"Error parsing item: {e}")
            continue
    
    return leagues


def scrape_using_api_approach():
    """
    Many modern sites load data via API calls.
    Check the Network tab in Chrome DevTools to find these endpoints.
    """
    
    # Example API endpoint (found by inspecting network traffic)
    api_url = "https://api.example.com/leagues?state=CA"
    
    headers = {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Process JSON data
        leagues = []
        for item in data.get('results', []):
            league = {
                'name': item.get('name'),
                'city': item.get('city'),
                'state': item.get('state'),
                'website': item.get('url')
            }
            leagues.append(league)
        
        return leagues
        
    except Exception as e:
        print(f"Error with API request: {e}")
        return []


def scrape_local_html_file(filepath):
    """
    Test your scraper on a saved HTML file first.
    
    Usage:
        1. Go to the website in your browser
        2. Right-click > Save As > Save complete webpage
        3. Run this function on the saved file
    """
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Test your selectors here
    items = soup.find_all('div', class_='league-card')
    print(f"Found {len(items)} league cards")
    
    for item in items[:5]:  # Show first 5
        print("\n" + "="*50)
        print(item.get_text().strip())
        print("="*50)


def main():
    """
    Test different scraping approaches
    """
    
    print("=" * 60)
    print("FLAG FOOTBALL DIRECTORY - TEST SCRAPER")
    print("=" * 60)
    
    # Option 1: Test with saved HTML file
    print("\n1. Testing with saved HTML file...")
    print("   (Save a webpage as HTML and update the path)")
    # Uncomment to test:
    # scrape_local_html_file('saved_page.html')
    
    # Option 2: Scrape live site
    print("\n2. Scraping live site...")
    print("   (Update the URL and selectors in scrape_example_site())")
    # Uncomment to test:
    # leagues = scrape_example_site()
    # print(f"\nScraped {len(leagues)} leagues")
    
    # Option 3: Use API approach
    print("\n3. Using API approach...")
    print("   (Find API endpoint using Chrome DevTools Network tab)")
    # Uncomment to test:
    # leagues = scrape_using_api_approach()
    # print(f"\nFetched {len(leagues)} leagues from API")
    
    # Example: Show how to save results
    print("\n4. Saving results...")
    example_data = [
        {
            'name': 'Phoenix NFL FLAG',
            'city': 'Phoenix',
            'state': 'AZ',
            'fees': 175.00,
            'website': 'https://example.com'
        },
        {
            'name': 'San Diego Youth Flag',
            'city': 'San Diego',
            'state': 'CA',
            'fees': 185.00,
            'website': 'https://example.com'
        }
    ]
    
    # Save as JSON
    with open('test_output.json', 'w') as f:
        json.dump(example_data, f, indent=2)
    
    print("   ✅ Saved to test_output.json")
    
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print("1. Inspect your target website using Chrome DevTools")
    print("2. Find the CSS selectors for league/event items")
    print("3. Update the selectors in scrape_example_site()")
    print("4. Run the scraper and verify results")
    print("5. Use import_to_supabase.py to import to database")
    print("=" * 60)


if __name__ == '__main__':
    main()