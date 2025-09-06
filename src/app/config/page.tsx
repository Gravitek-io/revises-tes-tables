"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { GameStorage } from "@/lib/storage";
import { GameSettings } from "@/types";

const AVAILABLE_TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const QUESTION_OPTIONS = [5, 10, 15, 20, 25, 30];

export default function ConfigPage() {
  const [settings, setSettings] = useState<GameSettings>({
    numberOfQuestions: 10,
    selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentSettings = GameStorage.getSettings();
    setSettings(currentSettings);
    setIsLoaded(true);
  }, []);

  const handleTableToggle = (table: number) => {
    const newSelectedTables = settings.selectedTables.includes(table)
      ? settings.selectedTables.filter((t) => t !== table)
      : [...settings.selectedTables, table].sort((a, b) => a - b);

    if (newSelectedTables.length === 0) {
      toast.error("Tu dois sélectionner au moins une table !");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      selectedTables: newSelectedTables,
    }));
    setHasChanges(true);
  };

  const handleQuestionCountChange = (count: number) => {
    setSettings((prev) => ({
      ...prev,
      numberOfQuestions: count,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    GameStorage.saveSettings(settings);
    setHasChanges(false);
    toast.success("✅ Configuration sauvegardée !");
  };

  const handleReset = () => {
    const defaultSettings = {
      numberOfQuestions: 10,
      selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info("Configuration réinitialisée");
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Es-tu sûr de vouloir effacer tout l&apos;historique ? Cette action est irréversible."
      )
    ) {
      GameStorage.clearAllData();
      toast.success("🗑️ Historique effacé !");
      // Reload settings after clearing
      const newSettings = GameStorage.getSettings();
      setSettings(newSettings);
      setHasChanges(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 transform hover:scale-105">
                <ArrowLeft className="h-6 w-6" />
              </button>
            </Link>
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Configuration</h1>
            </div>
          </div>

          {hasChanges && (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Sauvegarder</span>
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Number of Questions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 slide-up">
            <h2 className="text-xl font-semibold text-white mb-4">
              Nombre de questions par session
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {QUESTION_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => handleQuestionCountChange(count)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    settings.numberOfQuestions === count
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Tables Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 bounce-in">
            <h2 className="text-xl font-semibold text-white mb-4">
              Tables à réviser
              <span className="text-white/70 text-sm ml-2">
                ({settings.selectedTables.length} sélectionnée
                {settings.selectedTables.length > 1 ? "s" : ""})
              </span>
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-3">
              {AVAILABLE_TABLES.map((table) => (
                <button
                  key={table}
                  onClick={() => handleTableToggle(table)}
                  className={`py-4 px-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    settings.selectedTables.includes(table)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg wiggle"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  ×{table}
                </button>
              ))}
            </div>

            {/* Quick Select */}
            <div className="mt-6">
              <h3 className="text-white/80 font-medium mb-3">
                Sélections rapides
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      selectedTables: [2, 3, 4, 5],
                    }));
                    setHasChanges(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                >
                  Faciles (2-5)
                </button>
                <button
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      selectedTables: [6, 7, 8, 9],
                    }));
                    setHasChanges(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                >
                  Moyennes (6-9)
                </button>
                <button
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      selectedTables: [10, 11, 12],
                    }));
                    setHasChanges(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                >
                  Difficiles (10-12)
                </button>
                <button
                  onClick={() => {
                    setSettings((prev) => ({
                      ...prev,
                      selectedTables: AVAILABLE_TABLES,
                    }));
                    setHasChanges(true);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                >
                  Toutes
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-green-400/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 slide-up">
            <h2 className="text-xl font-semibold text-white mb-4">
              Aperçu de ta session
            </h2>
            <div className="text-white/80 space-y-2">
              <p>
                <span className="font-semibold">Nombre de questions :</span>{" "}
                {settings.numberOfQuestions}
              </p>
              <p>
                <span className="font-semibold">Tables sélectionnées :</span>{" "}
                {settings.selectedTables.join(" × ")}
              </p>
              <p className="text-sm text-white/60 mt-3">
                Les questions seront mélangées aléatoirement entre toutes les
                tables sélectionnées.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Réinitialiser</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Trash2 className="h-5 w-5" />
              <span>Effacer l&apos;historique</span>
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                Retour à l&apos;accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
