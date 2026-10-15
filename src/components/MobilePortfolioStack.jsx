import React from 'react';

/**
 * MobilePortfolioStack / MobileStackedCardDeck
 * 
 * True ECS-style vertically stacked, scroll-driven card animation for mobile viewports.
 * 
 * Architecture & Mechanics:
 * 1. Native sticky flow positioning: Each card is sticky at `top: ${topOffset}px`.
 * 2. Z-indexing: Card k has `zIndex: 10 + k`, ensuring incoming cards naturally slide OVER previous cards.
 * 3. Card dimensions: Dedicated responsive card container (min-h-[460px] max-h-[calc(100svh-96px)]).
 *    Cards are never clipped by artificial parent overflow boundaries.
 * 4. Document progression: Card 0 pins at `topOffset`. Card 1 scrolls up in natural document flow
 *    and covers Card 0 cleanly with deep physical top shadow and specular glass sheen.
 * 5. Section exit: The final card has `marginBottom: 0`. As soon as it pins, continuing to scroll
 *    releases the entire stack seamlessly into the next section with zero blank areas,
 *    zero artificial loading indicators, and zero trailing empty track.
 */
export default function MobilePortfolioStack({
  items = [],
  renderCard,
  topOffset = 76,
  cardSpacing = 28,
  cardHeight = null,
  className = '',
}) {
  if (!items || items.length === 0) return null;
  const total = items.length;

  return (
    <div className={`relative w-full ${className}`}>
      {items.map((item, index) => {
        const stepNumber = String(index + 1).padStart(2, '0');
        const totalNumber = String(total).padStart(2, '0');
        const isFirst = index === 0;
        const isLast = index === total - 1;

        return (
          <div
            key={item.id || item.title || item.name || index}
            className="sticky w-full"
            style={{
              top: `${topOffset}px`,
              zIndex: 10 + index,
              marginBottom: isLast ? '0px' : `${cardSpacing}px`,
            }}
          >
            <div
              className="relative w-full max-w-md mx-auto rounded-3xl"
              style={{
                height: cardHeight ? (typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight) : 'auto',
                maxHeight: 'calc(100svh - 94px)',
              }}
            >
              {renderCard(item, index, {
                stepNumber,
                totalNumber,
                isFirst,
                isLast,
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export named alias to prevent any ReferenceError: MobileStackedCardDeck is not defined
export const MobileStackedCardDeck = MobilePortfolioStack;
