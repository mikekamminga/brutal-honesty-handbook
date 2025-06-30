#!/usr/bin/env python3
"""
Configuration for Multi-Agent Translation Workflow
"""

import os
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class ModelConfig:
    """Configuration for AI models"""
    model_name: str
    api_key_env: str
    max_tokens: int
    temperature: float
    timeout: int

@dataclass
class LanguageConfig:
    """Configuration for target languages"""
    language_code: str
    language_name: str
    formality_level: str  # formal, informal, mixed
    cultural_adaptation_level: str  # conservative, moderate, aggressive
    regional_variant: Optional[str] = None

class TranslationConfig:
    """Main configuration class"""
    
    # Model configurations
    MODELS = {
        "gemini": ModelConfig(
            model_name="gemini-2.5-pro",
            api_key_env="GOOGLE_API_KEY",
            max_tokens=8192,
            temperature=0.3,
            timeout=120
        ),
        "claude": ModelConfig(
            model_name="claude-3-5-sonnet-20241022",
            api_key_env="ANTHROPIC_API_KEY", 
            max_tokens=4096,
            temperature=0.2,
            timeout=90
        )
    }
    
    # Quality thresholds
    QUALITY_THRESHOLDS = {
        "critical_content": 95,  # Key concepts, exercises
        "standard_content": 90,  # Regular chapters
        "examples": 85,          # Cultural examples, stories
        "refinement_trigger": 90 # Trigger refinement if below this
    }
    
    # Language configurations
    SUPPORTED_LANGUAGES = {
        "spanish": LanguageConfig(
            language_code="es",
            language_name="Spanish",
            formality_level="mixed",
            cultural_adaptation_level="moderate",
            regional_variant="neutral_latin_american"
        ),
        "german": LanguageConfig(
            language_code="de", 
            language_name="German",
            formality_level="formal",
            cultural_adaptation_level="conservative",
            regional_variant="standard_german"
        ),
        "french": LanguageConfig(
            language_code="fr",
            language_name="French", 
            formality_level="formal",
            cultural_adaptation_level="moderate",
            regional_variant="standard_french"
        ),
        "portuguese": LanguageConfig(
            language_code="pt",
            language_name="Portuguese",
            formality_level="mixed",
            cultural_adaptation_level="moderate", 
            regional_variant="brazilian"
        ),
        "italian": LanguageConfig(
            language_code="it",
            language_name="Italian",
            formality_level="formal",
            cultural_adaptation_level="moderate"
        ),
        "dutch": LanguageConfig(
            language_code="nl",
            language_name="Dutch", 
            formality_level="informal",
            cultural_adaptation_level="moderate"
        ),
        "japanese": LanguageConfig(
            language_code="ja",
            language_name="Japanese",
            formality_level="formal",
            cultural_adaptation_level="aggressive"
        ),
        "korean": LanguageConfig(
            language_code="ko",
            language_name="Korean",
            formality_level="formal", 
            cultural_adaptation_level="aggressive"
        ),
        "chinese_simplified": LanguageConfig(
            language_code="zh-CN",
            language_name="Chinese (Simplified)",
            formality_level="formal",
            cultural_adaptation_level="aggressive"
        ),
        "chinese_traditional": LanguageConfig(
            language_code="zh-TW",
            language_name="Chinese (Traditional)",
            formality_level="formal",
            cultural_adaptation_level="aggressive"
        )
    }
    
    # Agent role assignments
    AGENT_ASSIGNMENTS = {
        "literary_analysis": "gemini",      # Deep contextual understanding
        "first_draft": "claude",            # High-quality translation
        "cultural_adaptation": "gemini",    # Cultural knowledge
        "quality_assurance": "claude",      # Analytical precision
        "refinement": "claude",             # Polish and refinement
        "consistency": "gemini"             # Large context handling
    }
    
    # Workflow settings
    WORKFLOW_SETTINGS = {
        "max_concurrent_chapters": 3,      # Process N chapters in parallel
        "enable_refinement": True,         # Auto-refine low QA scores
        "save_intermediate_results": True, # Save each iteration
        "enable_consistency_check": True,  # Cross-chapter consistency
        "auto_save_frequency": 5,          # Save every N chapters
        "max_retries": 3,                  # Retry failed operations
        "timeout_minutes": 30              # Max time per chapter
    }
    
    # Cost tracking
    COST_ESTIMATES = {
        "gemini": {
            "input_per_1k": 0.001,  # $0.001 per 1K input tokens
            "output_per_1k": 0.002  # $0.002 per 1K output tokens
        },
        "claude": {
            "input_per_1k": 0.003,  # $0.003 per 1K input tokens
            "output_per_1k": 0.015  # $0.015 per 1K output tokens
        }
    }
    
    # Domain-specific prompts
    DOMAIN_PROMPTS = {
        "psychology": {
            "therapeutic_concepts": "Maintain clinical accuracy while ensuring accessibility",
            "relationship_advice": "Adapt for cultural relationship norms", 
            "workplace_scenarios": "Localize for business culture",
            "self_help": "Preserve motivational and actionable tone"
        },
        "brutal_honesty_book": {
            "core_concept": "Brutal honesty must be culturally adapted while preserving impact",
            "directness": "Adjust communication directness for cultural norms",
            "examples": "Localize scenarios while maintaining psychological accuracy",
            "exercises": "Adapt activities for cultural context"
        }
    }
    
    # File and output settings
    OUTPUT_SETTINGS = {
        "base_output_dir": "translations",
        "create_language_subdirs": True,
        "include_metadata": True,
        "include_quality_reports": True,
        "export_formats": ["json", "markdown", "html"],
        "backup_originals": True
    }
    
    @classmethod
    def get_api_key(cls, model_type: str) -> str:
        """Get API key for specified model"""
        model_config = cls.MODELS.get(model_type)
        if not model_config:
            raise ValueError(f"Unknown model type: {model_type}")
        
        api_key = os.getenv(model_config.api_key_env)
        if not api_key:
            raise ValueError(f"Missing API key: {model_config.api_key_env}")
        
        return api_key
    
    @classmethod
    def get_language_config(cls, language: str) -> LanguageConfig:
        """Get configuration for target language"""
        lang_config = cls.SUPPORTED_LANGUAGES.get(language.lower())
        if not lang_config:
            raise ValueError(f"Unsupported language: {language}")
        
        return lang_config
    
    @classmethod
    def validate_environment(cls) -> Dict[str, bool]:
        """Validate that required API keys are available"""
        validation_results = {}
        
        for model_type, config in cls.MODELS.items():
            try:
                api_key = os.getenv(config.api_key_env)
                validation_results[model_type] = bool(api_key)
            except:
                validation_results[model_type] = False
        
        return validation_results
    
    @classmethod
    def estimate_cost(cls, word_count: int, target_languages: List[str]) -> Dict:
        """Estimate translation cost"""
        
        # Rough token estimation (1 word ≈ 1.3 tokens)
        estimated_tokens = word_count * 1.3
        
        cost_breakdown = {}
        total_cost = 0
        
        for language in target_languages:
            # Estimated tokens per phase (multipliers based on workflow)
            gemini_input_tokens = estimated_tokens * 2.5   # Analysis + cultural + consistency
            gemini_output_tokens = estimated_tokens * 1.2
            
            claude_input_tokens = estimated_tokens * 3.0   # Draft + QA + refinement  
            claude_output_tokens = estimated_tokens * 1.5
            
            gemini_cost = (
                (gemini_input_tokens / 1000) * cls.COST_ESTIMATES["gemini"]["input_per_1k"] +
                (gemini_output_tokens / 1000) * cls.COST_ESTIMATES["gemini"]["output_per_1k"]
            )
            
            claude_cost = (
                (claude_input_tokens / 1000) * cls.COST_ESTIMATES["claude"]["input_per_1k"] +
                (claude_output_tokens / 1000) * cls.COST_ESTIMATES["claude"]["output_per_1k"]
            )
            
            language_cost = gemini_cost + claude_cost
            cost_breakdown[language] = {
                "gemini_cost": round(gemini_cost, 2),
                "claude_cost": round(claude_cost, 2), 
                "total_cost": round(language_cost, 2)
            }
            
            total_cost += language_cost
        
        return {
            "total_estimated_cost": round(total_cost, 2),
            "cost_per_language": cost_breakdown,
            "assumptions": {
                "word_count": word_count,
                "estimated_tokens": int(estimated_tokens),
                "languages": target_languages
            }
        }

# Environment setup helper
def setup_environment():
    """Helper to set up environment variables"""
    
    print("🔧 Translation Workflow Environment Setup")
    print("=========================================")
    
    # Check current environment
    validation = TranslationConfig.validate_environment()
    
    print("\n📋 API Key Status:")
    for model, is_valid in validation.items():
        status = "✅ Available" if is_valid else "❌ Missing"
        env_var = TranslationConfig.MODELS[model].api_key_env
        print(f"  {model.title()}: {status} ({env_var})")
    
    # Show setup instructions if keys are missing
    missing_keys = [model for model, valid in validation.items() if not valid]
    
    if missing_keys:
        print(f"\n⚠️  Missing API keys for: {', '.join(missing_keys)}")
        print("\n🔑 Setup Instructions:")
        
        for model in missing_keys:
            env_var = TranslationConfig.MODELS[model].api_key_env
            
            if model == "gemini":
                print(f"\n  For Google Gemini 2.5 Pro:")
                print(f"  1. Get API key from: https://aistudio.google.com/app/apikey")
                print(f"  2. Set environment variable: export {env_var}='your_api_key'")
                
            elif model == "claude":
                print(f"\n  For Anthropic Claude 3.5 Sonnet:")
                print(f"  1. Get API key from: https://console.anthropic.com/")
                print(f"  2. Set environment variable: export {env_var}='your_api_key'")
        
        print(f"\n💡 Or create a .env file in your project:")
        for model in missing_keys:
            env_var = TranslationConfig.MODELS[model].api_key_env
            print(f"  {env_var}=your_api_key_here")
    
    else:
        print("\n✅ All API keys are configured!")
    
    # Show supported languages
    print(f"\n🌍 Supported Languages ({len(TranslationConfig.SUPPORTED_LANGUAGES)}):")
    for lang_key, config in TranslationConfig.SUPPORTED_LANGUAGES.items():
        adaptation = config.cultural_adaptation_level
        formality = config.formality_level
        print(f"  • {config.language_name} ({lang_key}) - {adaptation} adaptation, {formality} tone")
    
    print(f"\n💰 Cost Estimation Example (10,000 words to Spanish):")
    cost_estimate = TranslationConfig.estimate_cost(10000, ["spanish"])
    print(f"  Estimated cost: ${cost_estimate['total_estimated_cost']}")
    print(f"  Gemini 2.5 Pro: ${cost_estimate['cost_per_language']['spanish']['gemini_cost']}")
    print(f"  Claude 3.5 Sonnet: ${cost_estimate['cost_per_language']['spanish']['claude_cost']}")

if __name__ == "__main__":
    setup_environment() 