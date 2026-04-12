
const LoginHeroImage = () => {
  return (
    <div className="relative order-first lg:order-last">
      <div className="bg-primary rounded-3xl overflow-hidden h-[500px] relative">
        <img
          src="/msb-uploads/c368be42-0a2d-44ff-84e6-f7b7083658e3.png"
          alt="Person with dreadlocks in white shirt"
          className="absolute right-8 top-8 w-80 h-80 object-cover rounded-2xl"
        />
        <div className="absolute bottom-8 left-8 w-32 h-32 bg-primary rounded-2xl"></div>
      </div>
    </div>
  );
};

export default LoginHeroImage;
