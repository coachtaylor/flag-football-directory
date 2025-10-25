from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client
import os

PROJECT_ROOT = Path('.').resolve().parent.parent
load_dotenv(PROJECT_ROOT / '.env.local')

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print('🔌 Connecting to Supabase...')
supabase = create_client(url, key)

try:
    result = supabase.table('cities').select('*').limit(5).execute()
    print(f'✅ Connected! Found {len(result.data)} cities in database')
    if result.data:
        print('Sample cities:', [city['name'] for city in result.data[:3]])
    else:
        print('(Database is empty - that is okay!)')
except Exception as e:
    print(f'❌ Error: {e}')
