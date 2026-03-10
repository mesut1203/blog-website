
export default function PostList() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-8">Latest Posts</h2>

      <div className="space-y-10">
        {/* Post 1 */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-semibold hover:text-blue-500 cursor-pointer">
            Understanding React Hooks
          </h3>

          <p className="text-gray-600 mt-2">
            Learn how React hooks work and how to use them effectively.
          </p>

          <span className="text-sm text-gray-400 block mt-2">March 2026</span>
        </div>

        {/* Post 2 */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-semibold hover:text-blue-500 cursor-pointer">
            JavaScript Event Loop Explained
          </h3>

          <p className="text-gray-600 mt-2">
            A deep dive into how the JavaScript event loop works.
          </p>

          <span className="text-sm text-gray-400 block mt-2">
            February 2026
          </span>
        </div>

        {/* Post 3 */}
        <div className="border-b pb-6">
          <h3 className="text-xl font-semibold hover:text-blue-500 cursor-pointer">
            Why I Started This Blog
          </h3>

          <p className="text-gray-600 mt-2">
            Documenting my learning journey in programming and science.
          </p>

          <span className="text-sm text-gray-400 block mt-2">January 2026</span>
        </div>
      </div>
    </section>
  );
}
