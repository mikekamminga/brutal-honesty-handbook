#!/usr/bin/env python3
"""
Multi-Agent Translation Workflow System
Using Gemini 2.5 Pro and Claude 3.5 Sonnet

This system creates a sophisticated translation pipeline with multiple AI agents,
each specialized for different aspects of book translation.
"""

import asyncio
import json
import logging
import os
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class TranslationTask:
    """Represents a single translation task"""
    chapter_id: str
    source_text: str
    target_language: str
    context: Dict
    metadata: Dict
    
@dataclass
class TranslationResult:
    """Represents the result of a translation iteration"""
    task_id: str
    agent_name: str
    iteration: int
    translation: str
    confidence_score: float
    quality_metrics: Dict
    notes: str
    timestamp: datetime

class TranslationAgent:
    """Base class for translation agents"""
    
    def __init__(self, name: str, model_name: str, specialization: str):
        self.name = name
        self.model_name = model_name
        self.specialization = specialization
        
    async def translate(self, task: TranslationTask, context: Dict = None) -> TranslationResult:
        """Override in subclasses"""
        raise NotImplementedError
        
    async def review(self, translation: str, original: str, context: Dict = None) -> Dict:
        """Override in subclasses"""
        raise NotImplementedError

class LiteraryAnalysisAgent(TranslationAgent):
    """
    Agent 1: Literary Analysis & Context Understanding
    Uses Gemini 2.5 Pro for deep literary analysis and context building
    """
    
    def __init__(self):
        super().__init__("Literary Analyst", "gemini-2.5-pro", "Literary Analysis & Context")
        
    async def analyze_book_structure(self, book_content: str, target_language: str) -> Dict:
        """Analyze the entire book for translation context"""
        
        analysis_prompt = f"""
        You are a literary analysis expert preparing a comprehensive translation blueprint.
        Analyze this book "The Handbook of Brutal Honesty" for translation into {target_language}.
        
        Create a detailed analysis covering:
        
        1. **Core Themes & Concepts**:
           - How "brutal honesty" translates culturally
           - Key psychological concepts that need careful handling
           - Recurring metaphors and their cultural equivalents
        
        2. **Author's Voice & Tone**:
           - Writing style characteristics
           - Formality level
           - Emotional register
           - Direct vs. indirect communication patterns
        
        3. **Cultural Adaptation Requirements**:
           - Examples that need localization
           - Cultural references requiring explanation
           - Concepts that may not exist in target culture
           - Sensitive topics requiring careful handling
        
        4. **Terminology Glossary**:
           - Key terms and their preferred translations
           - Consistent terminology requirements
           - Technical psychology terms
        
        5. **Structural Elements**:
           - Chapter organization
           - Exercise formats
           - Call-to-action styles
           - Transitional phrases
        
        Book content: {book_content[:10000]}...
        
        Provide a comprehensive JSON-structured analysis.
        """
        
        # This would call Gemini 2.5 Pro API
        analysis = await self._call_gemini_api(analysis_prompt)
        
        return {
            "literary_blueprint": analysis,
            "translation_guidelines": self._extract_guidelines(analysis),
            "cultural_notes": self._extract_cultural_notes(analysis),
            "terminology_glossary": self._extract_terminology(analysis)
        }
    
    async def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini 2.5 Pro API - placeholder for actual implementation"""
        # Implementation would use actual Gemini API
        logger.info(f"Calling Gemini 2.5 Pro for literary analysis")
        return "Detailed literary analysis result"
    
    def _extract_guidelines(self, analysis: str) -> List[str]:
        """Extract translation guidelines from analysis"""
        return ["Maintain direct tone", "Preserve psychological accuracy", "Adapt examples culturally"]
    
    def _extract_cultural_notes(self, analysis: str) -> List[str]:
        """Extract cultural adaptation notes"""
        return ["Brutal honesty concept varies by culture", "Workplace examples need localization"]
    
    def _extract_terminology(self, analysis: str) -> Dict[str, str]:
        """Extract terminology glossary"""
        return {"brutal honesty": "target_language_equivalent", "radical truth": "target_equivalent"}

class FirstDraftAgent(TranslationAgent):
    """
    Agent 2: First Draft Translation
    Uses Claude 3.5 Sonnet for initial high-quality translation
    """
    
    def __init__(self):
        super().__init__("First Draft Translator", "claude-3.5-sonnet", "Initial Translation")
        
    async def translate(self, task: TranslationTask, context: Dict = None) -> TranslationResult:
        """Create first draft translation"""
        
        translation_prompt = f"""
        You are a professional book translator specializing in psychology and self-help content.
        
        **Translation Task:**
        - Source: "The Handbook of Brutal Honesty" (English)
        - Target: {task.target_language}
        - Chapter: {task.chapter_id}
        
        **Context from Literary Analysis:**
        {json.dumps(context.get('literary_blueprint', {}), indent=2)}
        
        **Translation Guidelines:**
        {chr(10).join(f"- {guideline}" for guideline in context.get('translation_guidelines', []))}
        
        **Terminology to Use:**
        {json.dumps(context.get('terminology_glossary', {}), indent=2)}
        
        **Cultural Adaptation Notes:**
        {chr(10).join(f"- {note}" for note in context.get('cultural_notes', []))}
        
        **Source Text:**
        {task.source_text}
        
        **Instructions:**
        1. Translate accurately while preserving the author's direct, honest tone
        2. Adapt examples and cultural references for {task.target_language} readers
        3. Maintain psychological accuracy of concepts
        4. Use consistent terminology from the glossary
        5. Preserve the practical, actionable nature of the content
        6. Keep the same emotional impact and persuasive power
        
        Provide only the translation, maintaining the original formatting.
        """
        
        translation = await self._call_claude_api(translation_prompt)
        
        return TranslationResult(
            task_id=task.chapter_id,
            agent_name=self.name,
            iteration=1,
            translation=translation,
            confidence_score=0.85,
            quality_metrics={"completeness": 1.0, "fluency": 0.9},
            notes="First draft translation completed",
            timestamp=datetime.now()
        )
    
    async def _call_claude_api(self, prompt: str) -> str:
        """Call Claude 3.5 Sonnet API - placeholder for actual implementation"""
        logger.info(f"Calling Claude 3.5 Sonnet for first draft translation")
        return "First draft translation result"

class CulturalAdaptationAgent(TranslationAgent):
    """
    Agent 3: Cultural Adaptation & Localization
    Uses Gemini 2.5 Pro for cultural expertise and localization
    """
    
    def __init__(self):
        super().__init__("Cultural Adapter", "gemini-2.5-pro", "Cultural Adaptation")
        
    async def adapt_translation(self, translation: str, original: str, target_language: str, context: Dict) -> TranslationResult:
        """Adapt translation for cultural appropriateness"""
        
        adaptation_prompt = f"""
        You are a cultural localization expert specializing in {target_language} culture.
        
        **Task:** Review and adapt this translation of "The Handbook of Brutal Honesty" for cultural appropriateness.
        
        **Original English Text:**
        {original}
        
        **Current Translation:**
        {translation}
        
        **Cultural Adaptation Requirements:**
        1. **Communication Styles**: Adapt for {target_language} communication norms
        2. **Relationship Dynamics**: Adjust relationship advice for cultural context
        3. **Workplace Culture**: Modify professional examples appropriately
        4. **Family Dynamics**: Adapt family relationship advice
        5. **Conflict Resolution**: Adjust for cultural conflict resolution styles
        6. **Authority Relationships**: Modify based on cultural hierarchy norms
        
        **Specific Focus Areas:**
        - How "brutal honesty" is perceived in {target_language} culture
        - Appropriate levels of directness in communication
        - Cultural taboos or sensitive topics
        - Examples that need localization
        - Metaphors that don't translate culturally
        
        **Output Required:**
        1. Adapted translation with cultural modifications
        2. List of changes made and why
        3. Cultural notes for readers
        4. Confidence score (0-1) for cultural appropriateness
        
        Provide the adapted translation and detailed adaptation notes.
        """
        
        adaptation = await self._call_gemini_api(adaptation_prompt)
        
        return TranslationResult(
            task_id=f"cultural_adaptation_{datetime.now().timestamp()}",
            agent_name=self.name,
            iteration=2,
            translation=self._extract_adapted_translation(adaptation),
            confidence_score=0.90,
            quality_metrics={"cultural_appropriateness": 0.95, "localization": 0.88},
            notes=self._extract_adaptation_notes(adaptation),
            timestamp=datetime.now()
        )
    
    async def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini 2.5 Pro API"""
        logger.info(f"Calling Gemini 2.5 Pro for cultural adaptation")
        return "Cultural adaptation result"
    
    def _extract_adapted_translation(self, adaptation: str) -> str:
        """Extract the adapted translation from the response"""
        return "Culturally adapted translation"
    
    def _extract_adaptation_notes(self, adaptation: str) -> str:
        """Extract adaptation notes"""
        return "Cultural adaptation notes"

class QualityAssuranceAgent(TranslationAgent):
    """
    Agent 4: Quality Assurance & Consistency
    Uses Claude 3.5 Sonnet for detailed quality analysis
    """
    
    def __init__(self):
        super().__init__("Quality Assurance", "claude-3.5-sonnet", "Quality Control")
        
    async def quality_review(self, translation: str, original: str, context: Dict) -> Dict:
        """Comprehensive quality review"""
        
        qa_prompt = f"""
        You are a quality assurance expert for book translations.
        
        **Task:** Comprehensive quality review of this translation.
        
        **Original Text:**
        {original}
        
        **Translation:**
        {translation}
        
        **Quality Review Criteria:**
        
        1. **Accuracy (0-100)**:
           - Factual correctness
           - Concept preservation
           - No additions or omissions
        
        2. **Fluency (0-100)**:
           - Natural language flow
           - Grammar and syntax
           - Readability
        
        3. **Consistency (0-100)**:
           - Terminology consistency
           - Style consistency
           - Tone consistency
        
        4. **Cultural Appropriateness (0-100)**:
           - Cultural sensitivity
           - Appropriate examples
           - Localization quality
        
        5. **Impact Preservation (0-100)**:
           - Emotional impact maintained
           - Persuasive power preserved
           - Actionable clarity retained
        
        **Specific Issues to Check:**
        - Mistranslations or errors
        - Inconsistent terminology
        - Cultural inappropriateness
        - Loss of meaning or impact
        - Fluency problems
        
        **Output Format:**
        ```json
        {{
            "overall_score": 85,
            "accuracy": 90,
            "fluency": 85,
            "consistency": 80,
            "cultural_appropriateness": 90,
            "impact_preservation": 85,
            "issues": [
                {{
                    "type": "terminology",
                    "description": "Inconsistent translation of 'brutal honesty'",
                    "severity": "medium",
                    "suggestion": "Use consistent term throughout"
                }}
            ],
            "recommendations": [
                "Improve terminology consistency",
                "Enhance cultural adaptation"
            ]
        }}
        ```
        """
        
        qa_result = await self._call_claude_api(qa_prompt)
        return json.loads(qa_result)
    
    async def _call_claude_api(self, prompt: str) -> str:
        """Call Claude 3.5 Sonnet API"""
        logger.info(f"Calling Claude 3.5 Sonnet for quality assurance")
        return '{"overall_score": 85, "accuracy": 90, "fluency": 85, "consistency": 80, "cultural_appropriateness": 90, "impact_preservation": 85, "issues": [], "recommendations": []}'

class RefinementAgent(TranslationAgent):
    """
    Agent 5: Refinement & Polish
    Uses both models for final refinement
    """
    
    def __init__(self):
        super().__init__("Refinement Specialist", "claude-3.5-sonnet + gemini-2.5-pro", "Final Polish")
        
    async def refine_translation(self, translation: str, qa_feedback: Dict, context: Dict) -> TranslationResult:
        """Final refinement based on QA feedback"""
        
        refinement_prompt = f"""
        You are a translation refinement specialist.
        
        **Task:** Final polish of translation based on quality assurance feedback.
        
        **Current Translation:**
        {translation}
        
        **QA Feedback:**
        {json.dumps(qa_feedback, indent=2)}
        
        **Refinement Instructions:**
        1. Address all issues identified in QA feedback
        2. Improve areas with lower scores
        3. Enhance overall fluency and impact
        4. Ensure perfect consistency
        5. Maintain cultural appropriateness
        
        **Focus Areas:**
        - Fix any terminology inconsistencies
        - Improve fluency where needed
        - Enhance cultural adaptation
        - Strengthen emotional impact
        - Perfect grammar and syntax
        
        Provide the refined translation with improvement notes.
        """
        
        refined = await self._call_claude_api(refinement_prompt)
        
        return TranslationResult(
            task_id=f"refinement_{datetime.now().timestamp()}",
            agent_name=self.name,
            iteration=3,
            translation=refined,
            confidence_score=0.95,
            quality_metrics={"overall_quality": 0.95, "refinement_applied": True},
            notes="Final refinement completed",
            timestamp=datetime.now()
        )
    
    async def _call_claude_api(self, prompt: str) -> str:
        """Call Claude 3.5 Sonnet API"""
        logger.info(f"Calling Claude 3.5 Sonnet for refinement")
        return "Refined translation result"

class ConsistencyAgent(TranslationAgent):
    """
    Agent 6: Cross-Chapter Consistency
    Uses Gemini 2.5 Pro for book-wide consistency checks
    """
    
    def __init__(self):
        super().__init__("Consistency Guardian", "gemini-2.5-pro", "Cross-Chapter Consistency")
        
    async def ensure_consistency(self, all_translations: List[TranslationResult], context: Dict) -> Dict:
        """Ensure consistency across all chapters"""
        
        consistency_prompt = f"""
        You are a consistency specialist for book translations.
        
        **Task:** Ensure perfect consistency across all chapters of "The Handbook of Brutal Honesty".
        
        **All Chapter Translations:**
        {json.dumps([{"chapter": t.task_id, "translation": t.translation[:500] + "..."} for t in all_translations], indent=2)}
        
        **Consistency Requirements:**
        
        1. **Terminology Consistency**:
           - Key terms translated identically throughout
           - Technical psychology terms consistent
           - Brand/book terminology uniform
        
        2. **Style Consistency**:
           - Tone maintained across chapters
           - Formality level uniform
           - Voice characteristics preserved
        
        3. **Cultural Adaptation Consistency**:
           - Cultural examples consistently adapted
           - Communication style uniform
           - Cultural references coherent
        
        4. **Structural Consistency**:
           - Chapter transitions smooth
           - Exercise formats uniform
           - Call-to-action styles consistent
        
        **Analysis Required:**
        - Identify inconsistencies
        - Suggest corrections
        - Provide consistency score (0-100)
        - Create final terminology glossary
        
        **Output Format:**
        ```json
        {{
            "consistency_score": 92,
            "terminology_issues": [],
            "style_issues": [],
            "cultural_issues": [],
            "structural_issues": [],
            "corrections": [],
            "final_glossary": {{}},
            "recommendations": []
        }}
        ```
        """
        
        consistency_result = await self._call_gemini_api(consistency_prompt)
        return json.loads(consistency_result)
    
    async def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini 2.5 Pro API"""
        logger.info(f"Calling Gemini 2.5 Pro for consistency analysis")
        return '{"consistency_score": 92, "terminology_issues": [], "style_issues": [], "cultural_issues": [], "structural_issues": [], "corrections": [], "final_glossary": {}, "recommendations": []}'

class TranslationWorkflow:
    """
    Master workflow orchestrator
    Coordinates all agents through multiple iterations
    """
    
    def __init__(self):
        self.agents = {
            "literary_analyst": LiteraryAnalysisAgent(),
            "first_draft": FirstDraftAgent(),
            "cultural_adapter": CulturalAdaptationAgent(),
            "qa_agent": QualityAssuranceAgent(),
            "refinement_agent": RefinementAgent(),
            "consistency_agent": ConsistencyAgent()
        }
        
        self.results = []
        self.context = {}
        
    async def translate_book(self, book_path: str, target_language: str, chapters: List[str] = None) -> Dict:
        """
        Complete book translation workflow
        
        Args:
            book_path: Path to the book content
            target_language: Target language for translation
            chapters: List of chapter IDs to translate (None for all)
            
        Returns:
            Complete translation results with quality metrics
        """
        
        logger.info(f"Starting book translation to {target_language}")
        
        # Phase 1: Literary Analysis & Context Building
        logger.info("Phase 1: Literary Analysis & Context Building")
        book_content = await self._load_book_content(book_path)
        self.context = await self.agents["literary_analyst"].analyze_book_structure(
            book_content, target_language
        )
        
        # Phase 2: Chapter-by-Chapter Translation (3 iterations each)
        logger.info("Phase 2: Chapter-by-Chapter Translation")
        chapter_results = []
        
        for chapter_id in chapters or await self._get_chapter_list(book_path):
            logger.info(f"Translating chapter: {chapter_id}")
            
            # Load chapter content
            chapter_content = await self._load_chapter_content(book_path, chapter_id)
            
            task = TranslationTask(
                chapter_id=chapter_id,
                source_text=chapter_content,
                target_language=target_language,
                context=self.context,
                metadata={"book_path": book_path}
            )
            
            # Iteration 1: First Draft
            first_draft = await self.agents["first_draft"].translate(task, self.context)
            
            # Iteration 2: Cultural Adaptation
            cultural_adaptation = await self.agents["cultural_adapter"].adapt_translation(
                first_draft.translation, task.source_text, target_language, self.context
            )
            
            # Iteration 3: Quality Assurance
            qa_feedback = await self.agents["qa_agent"].quality_review(
                cultural_adaptation.translation, task.source_text, self.context
            )
            
            # Iteration 4: Refinement (if needed)
            if qa_feedback.get("overall_score", 0) < 90:
                logger.info(f"Applying refinement to {chapter_id} (QA score: {qa_feedback.get('overall_score')})")
                refined_result = await self.agents["refinement_agent"].refine_translation(
                    cultural_adaptation.translation, qa_feedback, self.context
                )
                final_result = refined_result
            else:
                final_result = cultural_adaptation
            
            chapter_results.append({
                "chapter_id": chapter_id,
                "iterations": [first_draft, cultural_adaptation, final_result],
                "final_translation": final_result.translation,
                "qa_feedback": qa_feedback
            })
        
        # Phase 3: Cross-Chapter Consistency
        logger.info("Phase 3: Cross-Chapter Consistency Analysis")
        all_final_results = [r["iterations"][-1] for r in chapter_results]
        consistency_analysis = await self.agents["consistency_agent"].ensure_consistency(
            all_final_results, self.context
        )
        
        # Phase 4: Final Assembly
        logger.info("Phase 4: Final Assembly & Quality Report")
        final_book = await self._assemble_final_book(chapter_results, consistency_analysis)
        
        return {
            "translation_complete": True,
            "target_language": target_language,
            "chapters_translated": len(chapter_results),
            "total_iterations": sum(len(r["iterations"]) for r in chapter_results),
            "final_book": final_book,
            "quality_metrics": await self._calculate_overall_quality(chapter_results),
            "consistency_analysis": consistency_analysis,
            "context": self.context,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _load_book_content(self, book_path: str) -> str:
        """Load complete book content"""
        # Implementation would load from the book directory
        logger.info(f"Loading book content from {book_path}")
        return "Complete book content"
    
    async def _get_chapter_list(self, book_path: str) -> List[str]:
        """Get list of chapters to translate"""
        # Implementation would scan the book directory
        return ["01_what_brutal_honesty_is", "02_the_hidden_cost_of_hiding", "03_starting_with_yourself"]
    
    async def _load_chapter_content(self, book_path: str, chapter_id: str) -> str:
        """Load specific chapter content"""
        # Implementation would load individual chapter
        logger.info(f"Loading chapter content: {chapter_id}")
        return f"Content of chapter {chapter_id}"
    
    async def _assemble_final_book(self, chapter_results: List[Dict], consistency_analysis: Dict) -> Dict:
        """Assemble final translated book"""
        return {
            "chapters": {r["chapter_id"]: r["final_translation"] for r in chapter_results},
            "consistency_score": consistency_analysis.get("consistency_score", 0),
            "final_glossary": consistency_analysis.get("final_glossary", {}),
            "total_words": sum(len(r["final_translation"].split()) for r in chapter_results)
        }
    
    async def _calculate_overall_quality(self, chapter_results: List[Dict]) -> Dict:
        """Calculate overall quality metrics"""
        qa_scores = [r["qa_feedback"].get("overall_score", 0) for r in chapter_results]
        
        return {
            "average_quality": sum(qa_scores) / len(qa_scores) if qa_scores else 0,
            "min_quality": min(qa_scores) if qa_scores else 0,
            "max_quality": max(qa_scores) if qa_scores else 0,
            "chapters_above_90": sum(1 for score in qa_scores if score >= 90),
            "chapters_needing_review": sum(1 for score in qa_scores if score < 85)
        }

# Usage example
async def main():
    """Example usage of the translation workflow"""
    
    workflow = TranslationWorkflow()
    
    # Translate the book to Spanish
    result = await workflow.translate_book(
        book_path="book/",
        target_language="Spanish",
        chapters=["01_what_brutal_honesty_is", "02_the_hidden_cost_of_hiding"]
    )
    
    print(f"Translation completed!")
    print(f"Quality metrics: {result['quality_metrics']}")
    print(f"Consistency score: {result['consistency_analysis']['consistency_score']}")
    
    # Save results
    with open(f"translation_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w') as f:
        json.dump(result, f, indent=2, default=str)

if __name__ == "__main__":
    asyncio.run(main()) 