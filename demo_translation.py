#!/usr/bin/env python3
"""
Demo and Testing Script for Multi-Agent Translation Workflow
"""

import asyncio
import json
from datetime import datetime
from translation_workflow import translate_to_language, TranslationWorkflow
from translation_config import TranslationConfig, setup_environment

async def demo_basic_translation():
    """Demo basic translation functionality"""
    print("🎬 Demo: Basic Translation Workflow")
    print("=" * 50)
    
    try:
        # Translate a single chapter to Spanish
        result = await translate_to_language(
            target_language="Spanish",
            chapters=["01_what_brutal_honesty_is"]
        )
        
        print(f"\n✅ Translation Summary:")
        print(f"   Language: {result['target_language']}")
        print(f"   Chapters: {result['chapters_translated']}")
        print(f"   Quality: {result['quality_metrics']['average_quality']:.1f}/100")
        print(f"   Time: {result['processing_time']}")
        print(f"   Consistency: {result['consistency_analysis']['consistency_score']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        return None

async def demo_multi_language():
    """Demo multi-language translation"""
    print("\n🌍 Demo: Multi-Language Translation")
    print("=" * 50)
    
    languages = ["Spanish", "German", "French"]
    results = {}
    
    for language in languages:
        print(f"\n🔄 Translating to {language}...")
        
        try:
            result = await translate_to_language(
                target_language=language,
                chapters=["01_what_brutal_honesty_is"]  # Single chapter for demo
            )
            
            results[language] = {
                "status": "success",
                "quality": result['quality_metrics']['average_quality'],
                "time": result['processing_time']
            }
            
            print(f"   ✅ {language}: Quality {result['quality_metrics']['average_quality']:.1f}")
            
        except Exception as e:
            print(f"   ❌ {language}: Failed - {e}")
            results[language] = {"status": "failed", "error": str(e)}
    
    print(f"\n📊 Multi-Language Results:")
    for lang, result in results.items():
        if result["status"] == "success":
            print(f"   {lang}: ✅ Quality {result['quality']:.1f} in {result['time']}")
        else:
            print(f"   {lang}: ❌ {result['error']}")
    
    return results

async def demo_quality_analysis():
    """Demo quality analysis features"""
    print("\n🔍 Demo: Quality Analysis")
    print("=" * 50)
    
    workflow = TranslationWorkflow()
    
    # Simulate different quality scenarios
    quality_scenarios = [
        {"chapter": "High Quality", "score": 95},
        {"chapter": "Good Quality", "score": 87},
        {"chapter": "Needs Refinement", "score": 82},
        {"chapter": "Poor Quality", "score": 68}
    ]
    
    print("Quality Analysis Examples:")
    for scenario in quality_scenarios:
        chapter = scenario["chapter"]
        score = scenario["score"]
        
        if score >= 90:
            status = "✅ Approved"
            action = "No refinement needed"
        elif score >= 85:
            status = "⚠️  Good"
            action = "Optional refinement"
        elif score >= 70:
            status = "🔧 Needs Work"
            action = "Refinement required"
        else:
            status = "❌ Poor"
            action = "Re-translation required"
        
        print(f"   {chapter}: {score}/100 - {status} - {action}")
    
    return quality_scenarios

def demo_cost_estimation():
    """Demo cost estimation functionality"""
    print("\n💰 Demo: Cost Estimation")
    print("=" * 50)
    
    # Estimate costs for different scenarios
    scenarios = [
        {"name": "Single Chapter", "words": 2000, "languages": ["Spanish"]},
        {"name": "Full Book", "words": 50000, "languages": ["Spanish", "German"]},
        {"name": "Multi-Language Launch", "words": 50000, "languages": ["Spanish", "German", "French", "Portuguese", "Italian"]}
    ]
    
    for scenario in scenarios:
        name = scenario["name"]
        words = scenario["words"]
        languages = scenario["languages"]
        
        cost_estimate = TranslationConfig.estimate_cost(words, languages)
        
        print(f"\n📋 {name}:")
        print(f"   Words: {words:,}")
        print(f"   Languages: {', '.join(languages)} ({len(languages)} total)")
        print(f"   Estimated Cost: ${cost_estimate['total_estimated_cost']}")
        print(f"   Cost per Language: ${cost_estimate['total_estimated_cost']/len(languages):.2f}")
        
        if len(languages) == 1:
            lang_cost = cost_estimate['cost_per_language'][languages[0]]
            print(f"   Gemini 2.5 Pro: ${lang_cost['gemini_cost']}")
            print(f"   Claude 3.5 Sonnet: ${lang_cost['claude_cost']}")

def demo_agent_workflow():
    """Demo the agent workflow process"""
    print("\n🤖 Demo: Agent Workflow Process")
    print("=" * 50)
    
    workflow_steps = [
        {
            "phase": "Phase 1: Literary Analysis",
            "agent": "Literary Analysis Agent (Gemini 2.5 Pro)",
            "duration": "~30 minutes",
            "output": "Context, guidelines, terminology glossary"
        },
        {
            "phase": "Phase 2: Chapter Translation",
            "agent": "Multiple agents per chapter",
            "duration": "~20-30 min/chapter",
            "output": "Translated chapters with quality scores"
        },
        {
            "phase": "Phase 3: Consistency Check", 
            "agent": "Consistency Agent (Gemini 2.5 Pro)",
            "duration": "~45-60 minutes",
            "output": "Consistency analysis and corrections"
        },
        {
            "phase": "Phase 4: Final Assembly",
            "agent": "Automated process",
            "duration": "~10 minutes", 
            "output": "Complete translated book"
        }
    ]
    
    print("Workflow Process:")
    for i, step in enumerate(workflow_steps, 1):
        print(f"\n{i}. {step['phase']}")
        print(f"   Agent: {step['agent']}")
        print(f"   Duration: {step['duration']}")
        print(f"   Output: {step['output']}")
    
    # Chapter-level process
    print(f"\n📝 Per-Chapter Process (4 iterations):")
    chapter_steps = [
        "1. First Draft (Claude 3.5 Sonnet) - ~15-20 min",
        "2. Cultural Adaptation (Gemini 2.5 Pro) - ~20-25 min", 
        "3. Quality Assurance (Claude 3.5 Sonnet) - ~10-15 min",
        "4. Refinement (Claude 3.5 Sonnet) - ~15-20 min (if needed)"
    ]
    
    for step in chapter_steps:
        print(f"   {step}")

def demo_language_support():
    """Demo supported languages and configurations"""
    print("\n🌍 Demo: Language Support")
    print("=" * 50)
    
    languages = TranslationConfig.SUPPORTED_LANGUAGES
    
    print(f"Supported Languages ({len(languages)} total):")
    
    # Group by cultural adaptation level
    adaptation_groups = {}
    for lang_key, config in languages.items():
        level = config.cultural_adaptation_level
        if level not in adaptation_groups:
            adaptation_groups[level] = []
        adaptation_groups[level].append((lang_key, config))
    
    for level in ["conservative", "moderate", "aggressive"]:
        if level in adaptation_groups:
            print(f"\n{level.title()} Cultural Adaptation:")
            for lang_key, config in adaptation_groups[level]:
                variant = f" ({config.regional_variant})" if config.regional_variant else ""
                print(f"   • {config.language_name} ({lang_key}) - {config.formality_level} tone{variant}")

async def run_comprehensive_demo():
    """Run all demo functions"""
    print("🎯 Multi-Agent Translation Workflow - Comprehensive Demo")
    print("=" * 60)
    
    # Environment check
    print("\n🔧 Environment Check:")
    validation = TranslationConfig.validate_environment()
    all_keys_available = all(validation.values())
    
    if all_keys_available:
        print("✅ All API keys are configured - Live demos available")
        
        # Run live demos
        await demo_basic_translation()
        await demo_multi_language() 
        await demo_quality_analysis()
    else:
        print("⚠️  API keys missing - Running simulation demos only")
        print("Run 'python translation_config.py' for setup instructions")
        
        # Run simulation demos
        demo_agent_workflow()
        demo_cost_estimation()
        demo_language_support()
        await demo_quality_analysis()  # This one works without API keys
    
    print(f"\n🎉 Demo completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Test functions
async def test_workflow_components():
    """Test individual workflow components"""
    print("\n🧪 Testing Workflow Components")
    print("=" * 50)
    
    workflow = TranslationWorkflow()
    
    tests = [
        ("Load book content", workflow._load_book_content("book/")),
        ("Get chapter list", workflow._get_chapter_list("book/")),
        ("Load chapter content", workflow._load_chapter_content("book/", "01_what_brutal_honesty_is"))
    ]
    
    for test_name, test_coro in tests:
        try:
            result = await test_coro
            status = "✅ Pass" if result else "⚠️  Empty result"
            preview = str(result)[:50] + "..." if len(str(result)) > 50 else str(result)
            print(f"   {test_name}: {status} - {preview}")
        except Exception as e:
            print(f"   {test_name}: ❌ Failed - {e}")

def test_configuration():
    """Test configuration functionality"""
    print("\n⚙️  Testing Configuration")
    print("=" * 50)
    
    try:
        # Test language config
        spanish_config = TranslationConfig.get_language_config("spanish")
        print(f"✅ Spanish config: {spanish_config.language_name} - {spanish_config.formality_level}")
        
        # Test cost estimation
        cost = TranslationConfig.estimate_cost(1000, ["spanish"])
        print(f"✅ Cost estimation: ${cost['total_estimated_cost']} for 1000 words")
        
        # Test environment validation
        validation = TranslationConfig.validate_environment()
        print(f"✅ Environment validation: {validation}")
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")

if __name__ == "__main__":
    print("🚀 Starting Translation Workflow Demo")
    
    # Run tests first
    test_configuration()
    asyncio.run(test_workflow_components())
    
    # Then run comprehensive demo
    asyncio.run(run_comprehensive_demo()) 