/** Simplified Traditional Kerala Poo Thoran (Garland) */
const SimplifiedPooThoran = ({ position }: { position: "left" | "right" }) => {
  const flowerCount = 8; // Adjust total flower density easily

  return (
    <div
      className={`absolute top-0 ${
        position === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"
      } z-30 pointer-events-none flex flex-col items-center select-none`}
    >
      {/* Central Garland Thread */}
      <div className="w-[1.5px] h-full absolute top-0 bg-amber-800/40 border-l border-dashed border-emerald-700/60 z-0" />

      {/* Main Top Knot Accent */}
      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-700 shadow-xs z-10 mb-1 border border-amber-300" />

      {/* Alternating Marigold Flowers & Leaves */}
      {Array.from({ length: flowerCount }).map((_, i) => {
        const isOrange = i % 2 === 0;

        return (
          <div key={`flower-node-${i}`} className="relative flex flex-col items-center my-[3px] sm:my-1.5 z-10">
            {/* Pair of Mango Leaves Behind Flower */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-0.5 gap-4 pointer-events-none z-0">
              <div className="w-2.5 sm:w-3.5 h-1 sm:h-1.5 bg-emerald-600 rounded-full -rotate-12 transform -translate-x-1 sm:-translate-x-1.5 border border-emerald-800/40" />
              <div className="w-2.5 sm:w-3.5 h-1 sm:h-1.5 bg-emerald-600 rounded-full rotate-12 transform translate-x-1 sm:translate-x-1.5 border border-emerald-800/40" />
            </div>

            {/* Simplified Layered Petal Marigold Flower */}
            <div className="relative flex items-center justify-center z-10">
              {/* Outer Petal Ring */}
              <div
                className={`w-6 h-6 sm:w-9 sm:h-9 rounded-full shadow-sm flex items-center justify-center transition-transform ${
                  isOrange
                    ? "bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400"
                    : "bg-gradient-to-tr from-yellow-600 via-yellow-400 to-amber-200"
                }`}
              >
                {/* Inner Petal Ring */}
                <div
                  className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-white/30 flex items-center justify-center ${
                    isOrange ? "bg-orange-600" : "bg-yellow-500"
                  }`}
                >
                  {/* Flower Core */}
                  <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-950/80 shadow-inner" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Hanging Tassel Accent */}
      <div className="w-1 sm:w-1.5 h-6 sm:h-10 bg-gradient-to-b from-amber-500 to-orange-600 rounded-b-full shadow-xs mt-1 z-10" />
    </div>
  );
};
