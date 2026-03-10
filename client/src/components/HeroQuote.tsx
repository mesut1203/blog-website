
const HeroQuote = () => (
    <section className="relative w-full h-[600px] bg-[url('https://images.unsplash.com/photo-1462143338528-eca9936a4d09?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex items-center justify-center">

        {/* overlay cho dễ đọc chữ */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-8">
                Ta đặt giới hạn tuổi cho mọi thứ —
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">
                    {" "}
                    trừ sự ngu ngốc
                </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed">
                Một trang web blog cá nhân
            </p>
        </div>

    </section>
);

export default HeroQuote;
