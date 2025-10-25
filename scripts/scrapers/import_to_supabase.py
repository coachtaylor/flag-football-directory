"""
Import Scraped Data to Supabase
================================
This script imports scraped data (leagues, events, teams) into your Supabase database.

Usage:
    python import_to_supabase.py --file scraped_leagues.json --type leagues
    python import_to_supabase.py --file scraped_events.json --type events
"""

import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from typing import List, Dict
import argparse
from slugify import slugify

# Load environment variables
from pathlib import Path
PROJECT_ROOT = Path(__file__).parent.parent.parent
load_dotenv(PROJECT_ROOT / '.env.local')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Use service role key for imports

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class DataImporter:
    """Import scraped data into Supabase"""
    
    def __init__(self):
        self.supabase = supabase
        self.city_cache = {}  # Cache city lookups
    
    def load_data(self, filename: str) -> List[Dict]:
        """Load data from JSON file"""
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def get_or_create_city(self, city_name: str, state: str) -> int:
        """Get city_id or create new city if it doesn't exist"""
        
        # Check cache first
        cache_key = f"{city_name.lower()}-{state.upper()}"
        if cache_key in self.city_cache:
            return self.city_cache[cache_key]
        
        # Try to find existing city
        result = self.supabase.table('cities').select('id').eq('name', city_name).eq('state', state).execute()
        
        if result.data:
            city_id = result.data[0]['id']
            self.city_cache[cache_key] = city_id
            return city_id
        
        # Create new city
        slug = slugify(f"{city_name}-{state}")
        
        # Check if slug already exists, append number if needed
        existing = self.supabase.table('cities').select('id').eq('slug', slug).execute()
        if existing.data:
            slug = f"{slug}-{len(existing.data) + 1}"
        
        new_city = {
            'name': city_name,
            'state': state.upper(),
            'slug': slug
        }
        
        result = self.supabase.table('cities').insert(new_city).execute()
        city_id = result.data[0]['id']
        self.city_cache[cache_key] = city_id
        
        logger.info(f"Created new city: {city_name}, {state}")
        return city_id
    
    def import_leagues(self, data: List[Dict], dry_run: bool = False) -> Dict:
        """Import league data"""
        stats = {'success': 0, 'failed': 0, 'skipped': 0}
        
        for item in data:
            try:
                # Validate required fields
                if not item.get('name') or not item.get('city') or not item.get('state'):
                    logger.warning(f"Skipping league with missing required fields: {item.get('name', 'Unknown')}")
                    stats['skipped'] += 1
                    continue
                
                # Get or create city
                city_id = self.get_or_create_city(item['city'], item['state'])
                
                # Generate slug
                slug = slugify(item['name'])
                
                # Check if league already exists
                existing = self.supabase.table('leagues').select('id').eq('slug', slug).execute()
                if existing.data:
                    slug = f"{slug}-{existing.data[0]['id']}"
                
                # Prepare league data
                league_data = {
                    'name': item['name'],
                    'slug': slug,
                    'city_id': city_id,
                    'website': item.get('website'),
                    'fees': item.get('fees'),
                    'season_start': item.get('season_start'),
                    'season_end': item.get('season_end'),
                    'divisions': item.get('divisions', []),
                    'nights': item.get('nights', []),
                    'formats': item.get('formats', []),
                    'contact_type': item.get('contact_type'),
                    'comp_levels': item.get('comp_levels', []),
                    'signup_url': item.get('signup_url'),
                    'about': item.get('about'),
                    'contact_name': item.get('contact_name'),
                    'contact_email': item.get('contact_email'),
                    'contact_phone': item.get('contact_phone'),
                    'verified': False  # Scraped data starts as unverified
                }
                
                if dry_run:
                    logger.info(f"[DRY RUN] Would import: {league_data['name']}")
                    stats['success'] += 1
                else:
                    # Insert into database
                    result = self.supabase.table('leagues').insert(league_data).execute()
                    logger.info(f"Imported league: {league_data['name']}")
                    stats['success'] += 1
                
            except Exception as e:
                logger.error(f"Error importing league {item.get('name', 'Unknown')}: {e}")
                stats['failed'] += 1
        
        return stats
    
    def import_events(self, data: List[Dict], dry_run: bool = False) -> Dict:
        """Import event data (tournaments and clinics)"""
        stats = {'success': 0, 'failed': 0, 'skipped': 0}
        
        for item in data:
            try:
                # Validate required fields
                if not item.get('name') or not item.get('state') or not item.get('start_date'):
                    logger.warning(f"Skipping event with missing required fields: {item.get('name', 'Unknown')}")
                    stats['skipped'] += 1
                    continue
                
                # Generate slug
                slug = slugify(item['name'])
                
                # Check if event already exists
                existing = self.supabase.table('events').select('id').eq('slug', slug).execute()
                if existing.data:
                    slug = f"{slug}-{existing.data[0]['id']}"
                
                # Prepare event data
                event_data = {
                    'name': item['name'],
                    'slug': slug,
                    'kind': item.get('kind', 'tournament'),
                    'state': item['state'].upper(),
                    'location': item.get('location'),
                    'start_date': item['start_date'],
                    'end_date': item.get('end_date'),
                    'fee': item.get('fee'),
                    'divisions': item.get('divisions', []),
                    'formats': item.get('formats', []),
                    'contact_type': item.get('contact_type'),
                    'comp_levels': item.get('comp_levels', []),
                    'website': item.get('website'),
                    'signup_url': item.get('signup_url'),
                    'about': item.get('about'),
                    'contact_name': item.get('contact_name'),
                    'contact_email': item.get('contact_email'),
                    'contact_phone': item.get('contact_phone'),
                    'verified': False  # Scraped data starts as unverified
                }
                
                if dry_run:
                    logger.info(f"[DRY RUN] Would import: {event_data['name']}")
                    stats['success'] += 1
                else:
                    # Insert into database
                    result = self.supabase.table('events').insert(event_data).execute()
                    logger.info(f"Imported event: {event_data['name']}")
                    stats['success'] += 1
                
            except Exception as e:
                logger.error(f"Error importing event {item.get('name', 'Unknown')}: {e}")
                stats['failed'] += 1
        
        return stats
    
    def import_teams(self, data: List[Dict], dry_run: bool = False) -> Dict:
        """Import team data"""
        stats = {'success': 0, 'failed': 0, 'skipped': 0}
        
        for item in data:
            try:
                # Validate required fields
                if not item.get('name') or not item.get('city') or not item.get('state'):
                    logger.warning(f"Skipping team with missing required fields: {item.get('name', 'Unknown')}")
                    stats['skipped'] += 1
                    continue
                
                # Get or create city
                city_id = self.get_or_create_city(item['city'], item['state'])
                
                # Generate slug
                slug = slugify(item['name'])
                
                # Check if team already exists
                existing = self.supabase.table('teams').select('id').eq('slug', slug).execute()
                if existing.data:
                    slug = f"{slug}-{existing.data[0]['id']}"
                
                # Prepare team data
                team_data = {
                    'name': item['name'],
                    'slug': slug,
                    'city_id': city_id,
                    'gender': item.get('gender'),
                    'age_groups': item.get('age_groups', []),
                    'comp_levels': item.get('comp_levels', []),
                    'formats': item.get('formats', []),
                    'contact_type': item.get('contact_type'),
                    'about': item.get('about'),
                    'accomplishments': item.get('accomplishments'),
                    'website': item.get('website'),
                    'signup_url': item.get('signup_url'),
                    'contact_name': item.get('contact_name'),
                    'contact_email': item.get('contact_email'),
                    'contact_phone': item.get('contact_phone'),
                    'verified': False  # Scraped data starts as unverified
                }
                
                if dry_run:
                    logger.info(f"[DRY RUN] Would import: {team_data['name']}")
                    stats['success'] += 1
                else:
                    # Insert into database
                    result = self.supabase.table('teams').insert(team_data).execute()
                    logger.info(f"Imported team: {team_data['name']}")
                    stats['success'] += 1
                
            except Exception as e:
                logger.error(f"Error importing team {item.get('name', 'Unknown')}: {e}")
                stats['failed'] += 1
        
        return stats


def main():
    """Main import function"""
    parser = argparse.ArgumentParser(description='Import scraped data to Supabase')
    parser.add_argument('--file', required=True, help='JSON file to import')
    parser.add_argument('--type', required=True, choices=['leagues', 'events', 'teams'], 
                       help='Type of data to import')
    parser.add_argument('--dry-run', action='store_true', help='Test run without importing')
    
    args = parser.parse_args()
    
    # Initialize importer
    importer = DataImporter()
    
    # Load data
    logger.info(f"Loading data from {args.file}")
    data = importer.load_data(args.file)
    logger.info(f"Loaded {len(data)} records")
    
    # Import based on type
    if args.type == 'leagues':
        stats = importer.import_leagues(data, dry_run=args.dry_run)
    elif args.type == 'events':
        stats = importer.import_events(data, dry_run=args.dry_run)
    elif args.type == 'teams':
        stats = importer.import_teams(data, dry_run=args.dry_run)
    
    # Print summary
    logger.info("\n" + "="*50)
    logger.info("IMPORT SUMMARY")
    logger.info("="*50)
    logger.info(f"Success: {stats['success']}")
    logger.info(f"Failed: {stats['failed']}")
    logger.info(f"Skipped: {stats['skipped']}")
    logger.info("="*50)
    
    if args.dry_run:
        logger.info("\nThis was a DRY RUN. No data was imported.")
        logger.info("Run without --dry-run to actually import data.")


if __name__ == '__main__':
    main()