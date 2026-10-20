import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import {
  CreditCard,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Download,
  Plus,
  Trash2,
  Play
} from 'lucide-react';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  mastered: boolean;
}

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [deckName, setDeckName] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateFlashcards = () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const topic = deckName || 'Study Material';
      const mockCards: Flashcard[] = [
        {
          id: 1,
          front: `What is the main concept of ${topic}?`,
          back: `${topic} involves understanding key principles and applying them effectively in various contexts.`,
          mastered: false
        },
        {
          id: 2,
          front: `How does ${topic} relate to practical applications?`,
          back: `${topic} can be applied in real-world scenarios to solve problems and improve outcomes.`,
          mastered: false
        },
        {
          id: 3,
          front: `What are the key benefits of studying ${topic}?`,
          back: `Studying ${topic} enhances critical thinking, problem-solving skills, and domain expertise.`,
          mastered: false
        },
        {
          id: 4,
          front: `What challenges might you face when learning ${topic}?`,
          back: `Common challenges include complexity, time management, and maintaining consistent practice.`,
          mastered: false
        },
        {
          id: 5,
          front: `How can you effectively master ${topic}?`,
          back: `Regular practice, spaced repetition, and active recall are essential for mastering ${topic}.`,
          mastered: false
        }
      ];

      setFlashcards(mockCards);
      setIsGenerating(false);
    }, 1500);
  };

  const addManualCard = () => {
    const newCard: Flashcard = {
      id: flashcards.length + 1,
      front: 'Front of card (Question)',
      back: 'Back of card (Answer)',
      mastered: false
    };
    setFlashcards([...flashcards, newCard]);
  };

  const deleteCard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  const toggleMastered = (id: number) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, mastered: !card.mastered } : card
    ));
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const masteredCount = flashcards.filter(c => c.mastered).length;
  const progress = flashcards.length > 0 ? (masteredCount / flashcards.length) * 100 : 0;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 p-6 pb-24 lg:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  AI Flashcard Generator
                </h1>
                <p className="text-gray-600">Create smart flashcards with spaced repetition</p>
              </div>
            </div>
          </div>

          {!studyMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generator Section */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                    Generate Flashcards
                  </CardTitle>
                  <CardDescription>Enter your study material and we'll create flashcards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deck Name</label>
                    <Input
                      placeholder="e.g., Biology Chapter 5"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Study Material</label>
                    <Textarea
                      placeholder="Paste your notes, textbook content, or any study material here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      rows={10}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={generateFlashcards}
                      disabled={isGenerating || !inputText.trim()}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                    </Button>
                    <Button
                      onClick={addManualCard}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Manual
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Flashcards List */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Flashcards</CardTitle>
                      <CardDescription>{flashcards.length} cards • {masteredCount} mastered</CardDescription>
                    </div>
                    {flashcards.length > 0 && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => setStudyMode(true)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Study Mode
                      </Button>
                    )}
                  </div>
                  {flashcards.length > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-yellow-600 to-orange-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {flashcards.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <CreditCard className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p>No flashcards yet. Generate some to get started!</p>
                    </div>
                  ) : (
                    flashcards.map((card, index) => (
                      <div
                        key={card.id}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            Card {index + 1}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={card.mastered ? "default" : "outline"}
                              onClick={() => toggleMastered(card.id)}
                              className={card.mastered ? "bg-green-600" : ""}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteCard(card.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-1">Q: {card.front}</p>
                        <p className="text-sm text-gray-600">A: {card.back}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            // Study Mode
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Study Mode</CardTitle>
                    <CardDescription>
                      Card {currentCardIndex + 1} of {flashcards.length}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setStudyMode(false)}
                  >
                    Exit Study Mode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto">
                  {/* Flashcard */}
                  <div
                    className="relative h-80 mb-6 cursor-pointer perspective-1000"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front */}
                      <div className={`absolute w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-300 flex items-center justify-center p-8 backface-hidden ${isFlipped ? 'hidden' : ''}`}>
                        <div className="text-center">
                          <Badge className="mb-4 bg-yellow-600">Question</Badge>
                          <p className="text-2xl font-semibold">
                            {flashcards[currentCardIndex]?.front}
                          </p>
                          <p className="text-sm text-gray-500 mt-6">Click to flip</p>
                        </div>
                      </div>
                      {/* Back */}
                      <div className={`absolute w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-300 flex items-center justify-center p-8 backface-hidden ${!isFlipped ? 'hidden' : ''}`}>
                        <div className="text-center">
                          <Badge className="mb-4 bg-blue-600">Answer</Badge>
                          <p className="text-xl">
                            {flashcards[currentCardIndex]?.back}
                          </p>
                          <p className="text-sm text-gray-500 mt-6">Click to flip back</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={previousCard}
                      disabled={flashcards.length <= 1}
                    >
                      ← Previous
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Flip
                      </Button>
                      <Button
                        size="sm"
                        variant={flashcards[currentCardIndex]?.mastered ? "default" : "outline"}
                        onClick={() => toggleMastered(flashcards[currentCardIndex]?.id)}
                        className={flashcards[currentCardIndex]?.mastered ? "bg-green-600" : ""}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {flashcards[currentCardIndex]?.mastered ? 'Mastered' : 'Mark Mastered'}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={nextCard}
                      disabled={flashcards.length <= 1}
                    >
                      Next →
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Study Progress</span>
                      <span>{masteredCount} / {flashcards.length} Mastered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
