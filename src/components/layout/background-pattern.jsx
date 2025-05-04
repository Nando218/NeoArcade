import React from 'react';

const BackgroundPattern = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 bg-black">
       
        <div 
          className="absolute inset-0 z-0"
          style={{
            '--c': '#09f',
            backgroundImage: `
              radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 235px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 117.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 252px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 252px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 126px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 150px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 150px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 75px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 253px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 253px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 126.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 204px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 204px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 102px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 134px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 134px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 67px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 179px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 179px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 89.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 299px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 299px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 149.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 215px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 215px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 107.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 281px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 281px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 140.5px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 158px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 158px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 79px, var(--c) 100%, #0000 150%),
              radial-gradient(4px 100px at 0px 210px, var(--c), #0000),
              radial-gradient(4px 100px at 300px 210px, var(--c), #0000),
              radial-gradient(1.5px 1.5px at 150px 105px, var(--c) 100%, #0000 150%)
            `,
            backgroundSize: `
              300px 235px,
              300px 235px,
              300px 235px,
              300px 252px,
              300px 252px,
              300px 252px,
              300px 150px,
              300px 150px,
              300px 150px,
              300px 253px,
              300px 253px,
              300px 253px,
              300px 204px,
              300px 204px,
              300px 204px,
              300px 134px,
              300px 134px,
              300px 134px,
              300px 179px,
              300px 179px,
              300px 179px,
              300px 299px,
              300px 299px,
              300px 299px,
              300px 215px,
              300px 215px,
              300px 215px,
              300px 281px,
              300px 281px,
              300px 281px,
              300px 158px,
              300px 158px,
              300px 158px,
              300px 210px,
              300px 210px,
              300px 210px
            `,
            animation: 'rain 150s linear infinite'
          }}
        />
        
        {/* El brillo y el blureado */}
        <div className="absolute inset-0 backdrop-blur-md backdrop-brightness-[4] bg-[radial-gradient(circle_at_50%_50%,#0000_0,#0000_2px,hsl(0_0%_4%)_2px)] bg-[length:8px_8px] z-10" />
      </div>
      
     
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default BackgroundPattern;