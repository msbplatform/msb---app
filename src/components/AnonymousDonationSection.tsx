
const AnonymousDonationSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Donate anonymously at
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                All of this text is editable. Simply click anywhere in the paragraph or heading 
                text and start typing. You can copy and paste your own content in to see what 
                it looks like with these font combinations. All of this text is editable. Simply 
                click anywhere in the paragraph or heading text and start typing. You can copy 
                and paste your own content in to see what it looks like with these font 
                combinations.
              </p>
              <p>
                All of this text is editable. Simply click anywhere in the 
                paragraph or heading text and start typing. You can copy and paste your own 
                content in to see what it looks like with these font combinations.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center"
              alt="Donation activities"
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnonymousDonationSection;
