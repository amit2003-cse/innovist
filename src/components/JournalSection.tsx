"use client";

import React, { useState } from "react";
import { JOURNAL_ARTICLES } from "@/data/faceCreams";
import { BookOpen, ArrowRight, X } from "lucide-react";

export default function JournalSection() {
  const [selectedArticle, setSelectedArticle] = useState<typeof JOURNAL_ARTICLES[0] | null>(null);

  return (
    <section className="py-4 sm:py-6 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
            From the Journal
          </h2>
        </div>

        <button
          onClick={() => setSelectedArticle(JOURNAL_ARTICLES[0])}
          className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-amber-600 transition flex items-center gap-1 group shrink-0"
        >
          <span>All Articles</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
        {JOURNAL_ARTICLES.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="cursor-pointer bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-zinc-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {article.tag}
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium">
                  {article.readTime}
                </span>
              </div>

              <h3 className="font-extrabold text-xs sm:text-base text-zinc-900 group-hover:text-amber-700 transition leading-snug">
                {article.title}
              </h3>

              <p className="text-[11px] sm:text-xs text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-[10px] font-bold">
                  Dr
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-zinc-900">{article.author}</p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-400">{article.date}</p>
                </div>
              </div>

              <span className="text-[11px] sm:text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read More →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Article Reading */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] sm:text-xs font-extrabold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {selectedArticle.tag}
            </span>

            <h2 className="text-base sm:text-xl font-black text-zinc-900 mt-2.5 leading-snug">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-2 my-2.5 text-[11px] sm:text-xs text-zinc-500">
              <span className="font-semibold text-zinc-800">{selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-zinc-700 leading-relaxed border-t border-zinc-100 pt-3">
              <p>{selectedArticle.excerpt}</p>
              <p>
                When selecting a face cream formulation, the key is understanding your stratum
                corneum lipid matrix. A damaged skin barrier often exhibits trans-epidermal water loss (TEWL),
                which can masquerade as dryness or lead to excess sebum overcompensation.
              </p>
              <p>
                <strong>Dermatologist Advice:</strong> For damaged or sensitized barriers, use bio-identical
                3:1:1 Ceramide to Cholesterol ratios. If your concern is hyperpigmentation, layer 10% 3-O-Ethyl
                Ascorbic Acid cream every morning beneath broad-spectrum SPF 50.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
