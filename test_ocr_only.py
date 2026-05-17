#!/usr/bin/env python3
"""
Focused OCR Extract Endpoint Test
Tests ONLY the OCR extract endpoint after model name fix (gpt-4.1)
"""

import requests
import base64
import json
import time
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

BASE_URL = "https://fc-pro-hub.preview.emergentagent.com/api"

def create_test_image():
    """Create a synthetic FC 26 post-match stats screenshot with player data"""
    img = Image.new('RGB', (1200, 800), color='white')
    draw = ImageDraw.Draw(img)
    
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

def test_ocr_extract_valid():
    """Test POST /api/ocr/extract with valid image"""
    print("\n" + "="*80)
    print("TEST 1: OCR Extract with Valid Image (POST /api/ocr/extract)")
    print("="*80)
    print("Testing model: gpt-4.1 (fix applied)")
    
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
        
        # Truncate response to 1KB as requested
        response_text = response.text
        if len(response_text) > 1024:
            response_text = response_text[:1024] + "... [truncated]"
        
        print(f"✓ Response Body (max 1KB): {response_text}")
        
        if response.status_code == 200:
            data = response.json()
            
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
                print("⚠ NOTE: No players extracted from image (GPT-4.1 may not have read names)")
                print("   This is acceptable - the goal is to confirm the call succeeds end-to-end")
            
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
                print("   Model 'gpt-4.1' is accepted by Emergent proxy")
                print("   End-to-end call succeeded and JSON parsed correctly")
                return True
            else:
                print("\n❌ FAIL: Some response structure checks failed")
                return False
        elif response.status_code == 500:
            print(f"❌ FAIL: Server error (500)")
            print(f"Response Body: {response.text}")
            
            # Check for specific error patterns
            if 'Invalid model name' in response.text or 'model=' in response.text:
                print("\n⚠ MODEL NAME ERROR: The model name is still being rejected")
                print("   Current model: gpt-4.1")
                print("   The Emergent proxy may require a different model name")
            elif 'auth' in response.text.lower() or 'unauthorized' in response.text.lower() or '401' in response.text:
                print("\n⚠ AUTH ERROR: EMERGENT_LLM_KEY authentication failed")
            else:
                print("\n⚠ UNKNOWN ERROR: See response body above")
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

def test_ocr_extract_empty_body():
    """Test POST /api/ocr/extract with empty body"""
    print("\n" + "="*80)
    print("TEST 2: OCR Extract with Empty Body (POST /api/ocr/extract)")
    print("="*80)
    
    try:
        payload = {}
        
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
                print("✅ PASS: Empty body correctly returns 400 with error message")
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
    """Run OCR extract tests only"""
    print("\n" + "="*80)
    print("VANGUARD XI - OCR EXTRACT ENDPOINT RETEST")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Model: gpt-4.1 (fix applied in /app/lib/services/ocr/providers/openai.js)")
    
    results = []
    
    # Run only OCR extract tests
    results.append(("OCR Extract (Valid Image)", test_ocr_extract_valid()))
    results.append(("OCR Extract (Empty Body)", test_ocr_extract_empty_body()))
    
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
        print("\n🎉 All OCR extract tests passed!")
        print("   The model name fix (gpt-4.1) resolved the issue")
        return 0
    else:
        print(f"\n⚠ {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
