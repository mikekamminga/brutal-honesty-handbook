#!/usr/bin/env python3
"""
Multi-Agent Translation Workflow System
Using Gemini 2.5 Pro and Claude 3.5 Sonnet
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class TranslationTask:
    chapter_id: str
    source_text: str
    target_language: str
    context: Dict
    metadata: Dict
    
@dataclass
class TranslationResult:
    task_id: str
    agent_name: str
    iteration: int
    translation: str
    confidence_score: float
    quality_metrics: Dict
    notes: str
    timestamp: datetime

class TranslationAgent:
    def __init__(self, name: str, model_name: str, specialization: str):
        self.name = name
        self.model_name = model_name
        self.specialization = specialization

class LiteraryAnalysisAgent(TranslationAgent):
    """Agent 1: Literary Analysis & Context Understanding (Gemini 2.5 Pro)"""
    
    def __init__(self):
        super().__init__("Literary Analyst", "gemini-2.5-pro", "Literary Analysis")
        
    async def analyze_book_structure(self, book_content: str, target_language: str) -> Dict:
        analysis_prompt = f"""
        Analyze "The Handbook of Brutal Honesty" for translation into {target_language}.
        
        Create analysis covering:
        1. Core themes & "brutal honesty" cultural translation
        2. Author's voice & tone characteristics  
        3. Cultural adaptation requirements
        4. Key terminology glossary
        5. Structural elements
        
        Book sample: {book_content[:5000]}...
        """
        
        # Call Gemini 2.5 Pro API here
        logger.info(f"[{self.name}] Analyzing book structure for {target_language}")
        
        return {
            "literary_blueprint": "Detailed analysis of themes and structure",
            "translation_guidelines": [
                "Maintain direct, honest tone",
                "Preserve psychological accuracy", 
                "Adapt examples culturally"
            ],
            "cultural_notes": [
                "Brutal honesty concept needs cultural adaptation",
                "Workplace examples require localization"
            ],
            "terminology_glossary": {
                "brutal_honesty": f"translated_term_{target_language}",
                "radical_truth": f"radical_truth_{target_language}"
            }
        }

class FirstDraftAgent(TranslationAgent):
    """Agent 2: First Draft Translation (Claude 3.5 Sonnet)"""
    
    def __init__(self):
        super().__init__("First Draft Translator", "claude-3.5-sonnet", "Initial Translation")
        
    async def translate(self, task: TranslationTask, context: Dict) -> TranslationResult:
        translation_prompt = f"""
        Translate chapter {task.chapter_id} of "The Handbook of Brutal Honesty" to {task.target_language}.
        
        Guidelines: {context.get('translation_guidelines', [])}
        Terminology: {context.get('terminology_glossary', {})}
        Cultural notes: {context.get('cultural_notes', [])}
        
        Source text: {task.source_text[:2000]}...
        
        Instructions:
        1. Maintain author's direct, honest tone
        2. Use provided terminology consistently
        3. Preserve psychological accuracy
        4. Keep actionable nature
        """
        
        # Call Claude 3.5 Sonnet API here
        logger.info(f"[{self.name}] Creating first draft for {task.chapter_id}")
        
        return TranslationResult(
            task_id=task.chapter_id,
            agent_name=self.name,
            iteration=1,
            translation="First draft translation result",
            confidence_score=0.85,
            quality_metrics={"completeness": 1.0, "fluency": 0.9},
            notes="First draft completed",
            timestamp=datetime.now()
        )

class CulturalAdaptationAgent(TranslationAgent):
    """Agent 3: Cultural Adaptation (Gemini 2.5 Pro)"""
    
    def __init__(self):
        super().__init__("Cultural Adapter", "gemini-2.5-pro", "Cultural Adaptation")
        
    async def adapt_translation(self, translation: str, original: str, target_language: str, context: Dict) -> TranslationResult:
        adaptation_prompt = f"""
        Culturally adapt this translation for {target_language} readers.
        
        Original: {original[:1000]}...
        Translation: {translation[:1000]}...
        
        Adapt for:
        1. Communication styles
        2. Relationship dynamics  
        3. Workplace culture
        4. Cultural sensitivity
        
        Focus on making "brutal honesty" concept culturally appropriate.
        """
        
        # Call Gemini 2.5 Pro API here  
        logger.info(f"[{self.name}] Adapting for {target_language} culture")
        
        return TranslationResult(
            task_id=f"cultural_{datetime.now().timestamp()}",
            agent_name=self.name,
            iteration=2,
            translation="Culturally adapted translation",
            confidence_score=0.90,
            quality_metrics={"cultural_appropriateness": 0.95},
            notes="Cultural adaptation completed",
            timestamp=datetime.now()
        )

class QualityAssuranceAgent(TranslationAgent):
    """Agent 4: Quality Assurance (Claude 3.5 Sonnet)"""
    
    def __init__(self):
        super().__init__("Quality Assurance", "claude-3.5-sonnet", "Quality Control")
        
    async def quality_review(self, translation: str, original: str, context: Dict) -> Dict:
        qa_prompt = f"""
        Quality review this translation (score 0-100 each):
        
        Original: {original[:1000]}...
        Translation: {translation[:1000]}...
        
        Rate:
        1. Accuracy (factual correctness)
        2. Fluency (natural flow)
        3. Consistency (terminology)
        4. Cultural appropriateness
        5. Impact preservation
        
        Return JSON with scores and recommendations.
        """
        
        # Call Claude 3.5 Sonnet API here
        logger.info(f"[{self.name}] Conducting quality review")
        
        return {
            "overall_score": 87,
            "accuracy": 92,
            "fluency": 85,
            "consistency": 83,
            "cultural_appropriateness": 89,
            "impact_preservation": 86,
            "recommendations": ["Improve consistency", "Enhance fluency"]
        }

class RefinementAgent(TranslationAgent):
    """Agent 5: Refinement & Polish (Claude 3.5 Sonnet)"""
    
    def __init__(self):
        super().__init__("Refinement Specialist", "claude-3.5-sonnet", "Final Polish")
        
    async def refine_translation(self, translation: str, qa_feedback: Dict, context: Dict) -> TranslationResult:
        refinement_prompt = f"""
        Refine this translation based on QA feedback:
        
        Translation: {translation[:1000]}...
        QA Score: {qa_feedback.get('overall_score', 0)}
        Issues: {qa_feedback.get('recommendations', [])}
        
        Focus on:
        1. Addressing QA recommendations
        2. Improving fluency and impact
        3. Ensuring consistency
        4. Perfecting grammar
        """
        
        # Call Claude 3.5 Sonnet API here
        logger.info(f"[{self.name}] Refining translation")
        
        return TranslationResult(
            task_id=f"refinement_{datetime.now().timestamp()}",
            agent_name=self.name,
            iteration=3,
            translation="Refined and polished translation",
            confidence_score=0.95,
            quality_metrics={"overall_quality": 0.95},
            notes="Final refinement completed",
            timestamp=datetime.now()
        )

class ConsistencyAgent(TranslationAgent):
    """Agent 6: Cross-Chapter Consistency (Gemini 2.5 Pro)"""
    
    def __init__(self):
        super().__init__("Consistency Guardian", "gemini-2.5-pro", "Consistency")
        
    async def ensure_consistency(self, all_translations: List[TranslationResult], context: Dict) -> Dict:
        consistency_prompt = f"""
        Ensure consistency across {len(all_translations)} chapters:
        
        Check:
        1. Terminology consistency
        2. Style uniformity  
        3. Cultural adaptation consistency
        4. Structural coherence
        
        Chapters: {[t.task_id for t in all_translations]}
        """
        
        # Call Gemini 2.5 Pro API here
        logger.info(f"[{self.name}] Analyzing cross-chapter consistency")
        
        return {
            "consistency_score": 94,
            "terminology_issues": [],
            "recommendations": ["Apply final standardization"],
            "final_glossary": {"brutal_honesty": "standardized_term"}
        }

class TranslationWorkflow:
    """Master workflow orchestrator"""
    
    def __init__(self):
        self.agents = {
            "literary_analyst": LiteraryAnalysisAgent(),
            "first_draft": FirstDraftAgent(),
            "cultural_adapter": CulturalAdaptationAgent(),
            "qa_agent": QualityAssuranceAgent(),
            "refinement_agent": RefinementAgent(),
            "consistency_agent": ConsistencyAgent()
        }
        self.context = {}
        
    async def translate_book(self, book_path: str, target_language: str, chapters: List[str] = None) -> Dict:
        """Complete book translation workflow"""
        
        logger.info(f"🚀 Starting translation to {target_language}")
        start_time = datetime.now()
        
        try:
            # Phase 1: Literary Analysis
            logger.info("📚 Phase 1: Literary Analysis")
            book_content = await self._load_book_content(book_path)
            self.context = await self.agents["literary_analyst"].analyze_book_structure(
                book_content, target_language
            )
            
            # Phase 2: Chapter Translation
            logger.info("📝 Phase 2: Chapter Translation")
            chapter_results = []
            chapters_to_translate = chapters or await self._get_chapter_list(book_path)
            
            for i, chapter_id in enumerate(chapters_to_translate, 1):
                logger.info(f"🔄 Translating {i}/{len(chapters_to_translate)}: {chapter_id}")
                
                chapter_content = await self._load_chapter_content(book_path, chapter_id)
                
                task = TranslationTask(
                    chapter_id=chapter_id,
                    source_text=chapter_content,
                    target_language=target_language,
                    context=self.context,
                    metadata={"book_path": book_path}
                )
                
                # Multi-iteration process
                first_draft = await self.agents["first_draft"].translate(task, self.context)
                
                cultural_adaptation = await self.agents["cultural_adapter"].adapt_translation(
                    first_draft.translation, task.source_text, target_language, self.context
                )
                
                qa_feedback = await self.agents["qa_agent"].quality_review(
                    cultural_adaptation.translation, task.source_text, self.context
                )
                
                # Refinement if needed
                if qa_feedback.get("overall_score", 0) < 90:
                    logger.info(f"   ✨ Applying refinement (QA: {qa_feedback.get('overall_score')})")
                    final_result = await self.agents["refinement_agent"].refine_translation(
                        cultural_adaptation.translation, qa_feedback, self.context
                    )
                else:
                    final_result = cultural_adaptation
                
                chapter_results.append({
                    "chapter_id": chapter_id,
                    "final_translation": final_result.translation,
                    "qa_feedback": qa_feedback,
                    "iterations": [first_draft, cultural_adaptation, final_result]
                })
            
            # Phase 3: Consistency Check
            logger.info("🔗 Phase 3: Consistency Analysis")
            all_final_results = [r["iterations"][-1] for r in chapter_results]
            consistency_analysis = await self.agents["consistency_agent"].ensure_consistency(
                all_final_results, self.context
            )
            
            # Phase 4: Final Assembly
            logger.info("📦 Phase 4: Final Assembly")
            end_time = datetime.now()
            
            result = {
                "translation_complete": True,
                "target_language": target_language,
                "chapters_translated": len(chapter_results),
                "processing_time": str(end_time - start_time),
                "quality_metrics": self._calculate_quality_metrics(chapter_results),
                "consistency_analysis": consistency_analysis,
                "chapter_results": chapter_results,
                "timestamp": datetime.now().isoformat()
            }
            
            logger.info(f"🎉 Translation completed successfully!")
            return result
            
        except Exception as e:
            logger.error(f"❌ Translation failed: {e}")
            raise
    
    async def _load_book_content(self, book_path: str) -> str:
        """Load complete book content"""
        try:
            import glob
            files = sorted(glob.glob(f"{book_path}/*.md"))
            content = ""
            for file_path in files[:3]:  # Limit for demo
                with open(file_path, 'r', encoding='utf-8') as f:
                    content += f.read() + "\n\n"
            return content
        except:
            return "Sample book content for demonstration"
    
    async def _get_chapter_list(self, book_path: str) -> List[str]:
        """Get list of chapters"""
        try:
            import glob
            files = sorted(glob.glob(f"{book_path}/*.md"))
            return [f.split('/')[-1].replace('.md', '') for f in files[:3]]  # Limit for demo
        except:
            return ["01_what_brutal_honesty_is", "02_the_hidden_cost_of_hiding"]
    
    async def _load_chapter_content(self, book_path: str, chapter_id: str) -> str:
        """Load chapter content"""
        try:
            with open(f"{book_path}/{chapter_id}.md", 'r', encoding='utf-8') as f:
                return f.read()
        except:
            return f"Sample content for {chapter_id}"
    
    def _calculate_quality_metrics(self, chapter_results: List[Dict]) -> Dict:
        """Calculate overall quality metrics"""
        scores = [r["qa_feedback"].get("overall_score", 0) for r in chapter_results]
        return {
            "average_quality": sum(scores) / len(scores) if scores else 0,
            "min_quality": min(scores) if scores else 0,
            "max_quality": max(scores) if scores else 0,
            "chapters_above_90": sum(1 for s in scores if s >= 90)
        }

# Usage functions
async def translate_to_language(target_language: str, chapters: List[str] = None):
    """Translate book to specific language"""
    workflow = TranslationWorkflow()
    result = await workflow.translate_book("book/", target_language, chapters)
    
    # Save results
    filename = f"translation_{target_language.lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False, default=str)
    
    logger.info(f"💾 Results saved to {filename}")
    return result

async def main():
    """Example usage"""
    result = await translate_to_language("Spanish", ["01_what_brutal_honesty_is"])
    
    print(f"\n🎉 Translation completed!")
    print(f"📊 Quality: {result['quality_metrics']['average_quality']:.1f}")
    print(f"🎯 Consistency: {result['consistency_analysis']['consistency_score']}")
    print(f"⏱️  Time: {result['processing_time']}")

if __name__ == "__main__":
    asyncio.run(main())
