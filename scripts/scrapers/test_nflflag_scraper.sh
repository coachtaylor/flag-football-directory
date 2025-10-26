#!/bin/bash
# Test NFL FLAG Selenium Scraper
# This script tests the scraper with a single ZIP code

echo "=========================================="
echo "NFL FLAG SCRAPER - TEST RUN"
echo "=========================================="
echo ""

# Check if in correct directory
if [ ! -f "nflflag_selenium_scraper.py" ]; then
    echo "❌ Error: nflflag_selenium_scraper.py not found"
    echo "   Make sure you're in the scripts/scrapers directory"
    exit 1
fi

# Check if venv is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated"
    echo "   Activating venv..."
    source venv/bin/activate
fi

# Check if selenium is installed
python -c "import selenium" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Selenium not installed"
    echo "   Installing selenium and webdriver-manager..."
    pip install selenium webdriver-manager
fi

echo "✅ Prerequisites checked"
echo ""
echo "🧪 Running test scrape..."
echo "   Location: Los Angeles (ZIP 90001)"
echo "   Mode: Visible browser (so you can see it work)"
echo ""
echo "Press ENTER to start..."
read

# Run the scraper (without --headless so you can watch)
python nflflag_selenium_scraper.py \
  --zip 90001 \
  --output test_nflflag

echo ""
echo "=========================================="
echo "TEST COMPLETE"
echo "=========================================="
echo ""
echo "📊 Check your results:"
echo ""
echo "   # View scraped data"
echo "   cat ../../scraped_data/raw/test_nflflag_*_leagues.json | python -m json.tool | head -50"
echo ""
echo "   # View found URLs"
echo "   cat ../../scraped_data/raw/test_nflflag_urls.txt"
echo ""
echo "   # View screenshots"
echo "   open ../../scraped_data/raw/nflflag_*.png"
echo ""
echo "🎯 Next: Import to database"
echo "   python import_to_supabase.py --file ../../scraped_data/raw/test_nflflag_*_leagues.json --type leagues --dry-run"
echo ""