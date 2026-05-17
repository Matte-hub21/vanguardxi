#!/usr/bin/env python3
"""
Backend API Tests for Vanguard XI OCR Pipeline
Tests the OCR extract and match save-stats endpoints
"""

import requests
import base64
import json
import time
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

# Read base URL from environment
BASE_URL = "https://fc-pro-hub.preview.emergentagent.com/api"

def create_test_image():
    """Create a synthetic FC 26 post-match stats screenshot with player data"""
    # Create a larger image with white background
    img = Image.new('RGB', (1200, 800), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try to use a default font, fallback to basic if not available
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Title
    draw.text((400, 20), "EA SPORTS FC 26 - MATCH STATS", fill='black', font=font_large)
    draw.text((450, 60), "VANGUARD XI vs PHOENIX REIGN", fill='black', font=font_medium)
    draw.text((550, 90), "FINAL SCORE: 3-1", fill='black', font=font_medium)
    
    # Column headers
    y_offset = 140
    draw.text((50, y_offset), "PLAYER", fill='black', font=font_medium)
    draw.text((250, y_offset), "POS", fill='black', font=font_medium)
    draw.text((350, y_offset), "RATING", fill='black', font=font_medium)
    draw.text((450, y_offset), "GOALS", fill='black', font=font_medium)
    draw.text((550, y_offset), "ASSISTS", fill='black', font=font_medium)
    draw.text((650, y_offset), "PASSES", fill='black', font=font_medium)
    draw.text((750, y_offset), "TACKLES", fill='black', font=font_medium)
    draw.text((850, y_offset), "SAVES", fill='black', font=font_medium)
    
    # Player stats (using real gamertags from the roster for fuzzy matching)
    players_data = [
        ("GHOST_07", "GK", "8.4", "0", "0", "32", "0", "6"),
        ("IronWall", "CB", "7.8", "0", "0", "45", "5", "0"),
        ("Vanguard_King", "CB", "8.1", "0", "0", "48", "4", "0"),
        ("BlitzLB", "LB", "7.5", "0", "1", "38", "3", "0"),
        ("RB_Phantom", "RB", "7.9", "0", "0", "42", "2", "0"),
        ("Maestro_10", "CM", "8.6", "0", "2", "72", "1", "0"),
        ("NeoStrike", "CM", "8.0", "1", "1", "65", "2", "0"),
        ("LW_Bolt", "LW", "8.4", "1", "0", "35", "0", "0"),
        ("RW_Fury", "RW", "8.2", "0", "1", "40", "1", "0"),
        ("GoldenBoot", "ST", "9.2", "2", "1", "28", "0", "0"),
    ]
    
    y_offset = 180
    for player_name, pos, rating, goals, assists, passes, tackles, saves in players_data:
        draw.text((50, y_offset), player_name, fill='black', font=font_small)
        draw.text((250, y_offset), pos, fill='black', font=font_small)
        draw.text((350, y_offset), rating, fill='black', font=font_small)
        draw.text((450, y_offset), goals, fill='black', font=font_small)
        draw.text((550, y_offset), assists, fill='black', font=font_small)
        draw.text((650, y_offset), passes, fill='black', font=font_small)
        draw.text((750, y_offset), tackles, fill='black', font=font_small)
        draw.text((850, y_offset), saves, fill='black', font=font_small)
        y_offset += 40
    
    # Convert to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_bytes = buffered.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    
    return img_base64

def test_health_check():
    """Test GET /api/ health check endpoint"""
    print("\n" + "="*80)
    print("TEST 1: Health Check (GET /api/)")
    print("="*80)
    
    try:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/", timeout=10)
        elapsed = time.time() - start_time
        
        print(f"✓ Request completed in {elapsed:.2f}s")
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok' and data.get('message') == 'Vanguard XI API':
                print("✅ PASS: Health check returned expected response")
                return True
            else:
                print(f"❌ FAIL: Unexpected response structure: {data}")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False

def test_ocr_extract_valid():
    """Test POST /api/ocr/extract with valid image"""
    print("\n" + "="*80)
    print("TEST 2: OCR Extract with Valid Image (POST /api/ocr/extract)")
    print("="*80)
    
    try:
        print("Creating synthetic test image with player stats...")
        img_base64 = create_test_image()
        print(f"✓ Test image created (base64 length: {len(img_base64)} chars)")
        
        payload = {
            "imageBase64": img_base64,
            "mimeType": "image/png"
        }
        
        print("Sending OCR request (this may take 5-15 seconds)...")
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/ocr/extract",
            json=payload,
            timeout=60
        )
        elapsed = time.time() - start_time
        
        print(f"✓ Request completed in {elapsed:.2f}s")
        print(f"✓ Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Response Body (truncated): {json.dumps(data, indent=2)[:500]}...")
            
            # Verify response structure
            checks = []
            checks.append(("ok field is true", data.get('ok') == True))
            checks.append(("players field exists", 'players' in data))
            checks.append(("players is array", isinstance(data.get('players'), list)))
            checks.append(("raw_result field exists", 'raw_result' in data))
            checks.append(("mvp_player_id field exists", 'mvp_player_id' in data))
            checks.append(("confidence field exists", 'confidence' in data))
            
            # Check player structure if players exist
            if data.get('players') and len(data['players']) > 0:
                player = data['players'][0]
                checks.append(("player has name", 'name' in player))
                checks.append(("player has rating", 'rating' in player))
                checks.append(("player has goals", 'goals' in player))
                checks.append(("player has assists", 'assists' in player))
                checks.append(("player has passes", 'passes' in player))
                checks.append(("player has tackles", 'tackles' in player))
                checks.append(("player has player_id", 'player_id' in player))
                checks.append(("player has matched_to", 'matched_to' in player))
                checks.append(("player has match_confidence", 'match_confidence' in player))
                
                print(f"\n✓ Extracted {len(data['players'])} players")
                print(f"✓ Sample player: {json.dumps(player, indent=2)}")
            else:
                print("⚠ WARNING: No players extracted from image")
            
            # Print check results
            print("\nResponse Structure Checks:")
            all_passed = True
            for check_name, check_result in checks:
                status = "✓" if check_result else "✗"
                print(f"  {status} {check_name}")
                if not check_result:
                    all_passed = False
            
            if all_passed:
                print("\n✅ PASS: OCR extract returned valid response structure")
                return True
            else:
                print("\n❌ FAIL: Some response structure checks failed")
                return False
        elif response.status_code == 500:
            print(f"❌ FAIL: Server error (500)")
            print(f"Response Body: {response.text}")
            # Check if it's an auth error
            if 'auth' in response.text.lower() or 'unauthorized' in response.text.lower() or '401' in response.text:
                print("\n⚠ POSSIBLE AUTH ISSUE: The error may be related to EMERGENT_LLM_KEY authentication")
                print("   Possible fixes:")
                print("   - Verify EMERGENT_LLM_KEY is correct in /app/.env")
                print("   - Try alternative base URLs:")
                print("     * https://llm-proxy.emergentagent.com/v1")
                print("     * https://api.emergent.sh/v1")
            return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response Body: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"❌ FAIL: Request timed out after 60 seconds")
        return False
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_ocr_extract_missing_image():
    """Test POST /api/ocr/extract with missing imageBase64"""
    print("\n" + "="*80)
    print("TEST 3: OCR Extract with Missing imageBase64 (POST /api/ocr/extract)")
    print("="*80)
    
    try:
        payload = {
            "mimeType": "image/png"
            # imageBase64 is intentionally missing
        }
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/ocr/extract",
            json=payload,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        print(f"✓ Request completed in {elapsed:.2f}s")
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data:
                print("✅ PASS: Missing imageBase64 correctly returns 400 with error message")
                return True
            else:
                print("❌ FAIL: 400 response but no error field in body")
                return False
        else:
            print(f"❌ FAIL: Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False

def test_save_match_stats_valid():
    """Test POST /api/match/save-stats with valid payload"""
    print("\n" + "="*80)
    print("TEST 4: Save Match Stats with Valid Payload (POST /api/match/save-stats)")
    print("="*80)
    
    try:
        payload = {
            "match_id": "m1",
            "score_us": 3,
            "score_them": 1,
            "players": [
                {
                    "player_id": "p11",
                    "rating": 9.2,
                    "goals": 2,
                    "assists": 1,
                    "tackles": 1,
                    "passes": 42
                },
                {
                    "player_id": "p6",
                    "rating": 8.4,
                    "goals": 0,
                    "assists": 2,
                    "tackles": 3,
                    "passes": 70
                }
            ]
        }
        
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/match/save-stats",
            json=payload,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        print(f"✓ Request completed in {elapsed:.2f}s")
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify response structure
            checks = []
            checks.append(("ok field is true", data.get('ok') == True))
            checks.append(("mvp_player_id field exists", 'mvp_player_id' in data))
            checks.append(("mvp_player_id is p11 (highest rating)", data.get('mvp_player_id') == 'p11'))
            
            print("\nResponse Structure Checks:")
            all_passed = True
            for check_name, check_result in checks:
                status = "✓" if check_result else "✗"
                print(f"  {status} {check_name}")
                if not check_result:
                    all_passed = False
            
            if all_passed:
                print("\n✅ PASS: Save match stats returned valid response with correct MVP")
                return True
            else:
                print("\n❌ FAIL: Some response checks failed")
                return False
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False

def test_save_match_stats_missing_players():
    """Test POST /api/match/save-stats with missing players field"""
    print("\n" + "="*80)
    print("TEST 5: Save Match Stats with Missing Players (POST /api/match/save-stats)")
    print("="*80)
    
    try:
        payload = {
            "match_id": "m1",
            "score_us": 3,
            "score_them": 1
            # players field is intentionally missing
        }
        
        start_time = time.time()
        response = requests.post(
            f"{BASE_URL}/match/save-stats",
            json=payload,
            timeout=10
        )
        elapsed = time.time() - start_time
        
        print(f"✓ Request completed in {elapsed:.2f}s")
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if 'error' in data:
                print("✅ PASS: Missing players field correctly returns 400 with error message")
                return True
            else:
                print("❌ FAIL: 400 response but no error field in body")
                return False
        else:
            print(f"❌ FAIL: Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("VANGUARD XI BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Run all tests
    results.append(("Health Check", test_health_check()))
    results.append(("OCR Extract (Valid)", test_ocr_extract_valid()))
    results.append(("OCR Extract (Missing Image)", test_ocr_extract_missing_image()))
    results.append(("Save Match Stats (Valid)", test_save_match_stats_valid()))
    results.append(("Save Match Stats (Missing Players)", test_save_match_stats_missing_players()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠ {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
