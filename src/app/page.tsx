"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Settings, BarChart3, Sparkles, Calculator } from "lucide-react";
import { GameStorage } from "@/lib/storage";
import { GameSettings, SessionStats } from "@/types";

export default function HomePage() {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSettings(GameStorage.getSettings());
    setStats(GameStorage.getStats());
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12 slide-up">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="h-16 w-16 text-white/90 mr-4" />
            <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
            Tables de Multiplication
          </h1>
          <p className="text-xl text-white/80 text-balance">
            Révise tes tables de façon ludique et amusante !
          </p>
        </div>

        {/* Quick Stats */}
        {stats && stats.totalSessions > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 bounce-in">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tes derniers progrès
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.totalSessions}
                </div>
                <div className="text-white/70 text-sm">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {stats.totalCorrectAnswers}
                </div>
                <div className="text-white/70 text-sm">Bonnes réponses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-300">
                  {Math.round(stats.averageScore)}%
                </div>
                <div className="text-white/70 text-sm">Score moyen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  {stats.strongestTable ? `×${stats.strongestTable}` : "---"}
                </div>
                <div className="text-white/70 text-sm">Table forte</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          {/* Start Game Button */}
          <Link href="/game">
            <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 bounce-in">
              <Play className="h-8 w-8" />
              <span>Commencer à jouer</span>
            </button>
          </Link>

          {/* Settings Display */}
          {settings && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white/80 text-center slide-up">
              <p className="text-sm">
                {settings.numberOfQuestions} questions • Tables:{" "}
                {settings.selectedTables.join(", ")}
              </p>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/config">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 slide-up">
                <Settings className="h-5 w-5" />
                <span>Configuration</span>
              </button>
            </Link>

            <Link href="/stats">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 slide-up">
                <BarChart3 className="h-5 w-5" />
                <span>Statistiques</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Welcome Message for First Time */}
        {!stats || stats.totalSessions === 0 ? (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl p-6 slide-up">
              <h3 className="text-white font-semibold mb-2">
                Première visite ? 🎉
              </h3>
              <p className="text-white/80 text-sm">
                Configure d&apos;abord tes paramètres, puis commence à réviser
                tes tables !
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Bon retour ! Prêt pour une nouvelle session ?
            </p>
          </div>
        )}
      </div>

      <div className="pt-16 text-center text-white/80 text-xs">
        <a
          href="https://gravitek.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:underline"
        >
          Gravitek
        </a>{" "}
        -{" "}
        <a
          href="mailto:hello@gravitek.io"
          className="text-white/80 hover:underline"
        >
          Nous contacter
        </a>
      </div>
    </div>
  );
}
