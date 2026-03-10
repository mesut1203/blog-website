import React from "react";
import Header from "../components/Header";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div>
      <Header />
      {/* Quote Section */}
      <section className="max-w-8xl my-20 bg-green-600 mx-auto px-6 py-16 text-center">
        <p className="text-2xl italic font-bold text-gray-700 leading-relaxed">
          "Writing is thinking. This blog is where I organize my thoughts,
          document what I learn, and explore ideas."
        </p>

        <p className="mt-4 text-gray-500">— Khải</p>
      </section>

      <PostList />
    </div>
  );
}
