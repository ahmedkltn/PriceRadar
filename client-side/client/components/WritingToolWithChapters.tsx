import svgPaths from "./svg-gbk5prcr4x";

function Text() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[48px] top-[6px] w-[93.75px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[20px] text-neutral-950 text-nowrap whitespace-pre">PriceRadar</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M16 7H22V13" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p13253c0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[14px] size-[40px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#00c950] left-[32px] rounded-[3.35544e+07px] size-[12px] top-[-4px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[3.35544e+07px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute left-0 size-[40px] top-0" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[40px] relative shrink-0 w-[141.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[40px] relative w-[141.75px]">
        <Text />
        <Container2 />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">How it works</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[38.141px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[38.141px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">About</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-[69.984px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center px-[13px] py-px relative w-[69.984px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Sign In</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[32px] relative shrink-0 w-[236.281px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[24px] h-[32px] items-center relative w-[236.281px]">
        <Link />
        <Link1 />
        <Button />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Navigation />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.6)] box-border content-stretch flex flex-col h-[73px] items-start left-0 pb-px pt-[16px] px-[16px] top-0 w-[1533px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Container4 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[17px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_173)" id="Icon">
          <path d={svgPaths.p1d19c880} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_1_173">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[41px] top-[9px] w-[183.922px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">AI-Powered Price Comparison</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-gradient-to-r from-[rgba(3,2,19,0.1)] h-[38px] left-[327.03px] rounded-[3.35544e+07px] to-[rgba(173,70,255,0.1)] top-0 w-[241.922px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(3,2,19,0.2)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Icon1 />
      <Text1 />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute font-['Arimo:Regular',sans-serif] font-normal h-[144px] leading-[72px] left-0 text-[72px] text-[rgba(0,0,0,0)] text-center text-nowrap top-0 w-[896px] whitespace-pre" data-name="Heading 1">
      <p className="absolute bg-clip-text left-[448.33px] top-[-7px] translate-x-[-50%]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(10, 10, 10) 0%, rgba(10, 10, 10, 0.7) 100%)" }}>
        Find the Best Deals
      </p>
      <p className="absolute bg-clip-text left-[447.66px] top-[65px] translate-x-[-50%]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgb(10, 10, 10) 0%, rgba(10, 10, 10, 0.7) 100%)" }}>
        Across the Web
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[56px] left-[112px] top-[160px] w-[672px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[28px] left-[336.45px] text-[#717182] text-[20px] text-center top-[-3px] translate-x-[-50%] w-[672px]">Our AI instantly compares prices from hundreds of retailers to help you save money on every purchase.</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[216px] left-0 top-[70px] w-[896px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-gradient-to-r blur-xl filter from-[#030213] h-[60px] left-0 opacity-20 rounded-[16px] to-[#ad46ff] top-0 w-[672px]" data-name="Container" />;
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] box-border content-stretch flex h-[56px] items-center left-[2px] overflow-clip pl-[56px] pr-[16px] py-[28px] rounded-[8px] top-[2px] w-[545.828px]" data-name="Input">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">Search for products, brands, or categories...</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#030213] box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center left-[555.83px] opacity-50 px-[32px] py-0 rounded-[14px] top-[10px] w-[106.172px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Search</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[26px] size-[20px] top-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M17.5 17.5L13.8833 13.8833" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pcddfd00} id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white h-[60px] left-0 rounded-[16px] top-0 w-[672px]" data-name="Container">
      <div className="h-[60px] overflow-clip relative rounded-[inherit] w-[672px]">
        <Input />
        <Button1 />
        <Icon2 />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute h-[60px] left-[112px] top-[318px] w-[672px]" data-name="Form">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[92.22px] top-[6px] w-[57.078px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#717182] text-[14px] text-center text-nowrap whitespace-pre">Trending:</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[157.3px] px-[13px] py-px rounded-[3.35544e+07px] top-0 w-[112.672px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">iPhone 15 Pro</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[277.97px] px-[13px] py-px rounded-[3.35544e+07px] top-0 w-[157.469px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Samsung Galaxy S24</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[443.44px] px-[13px] py-px rounded-[3.35544e+07px] top-0 w-[135.375px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">MacBook Pro M3</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[586.81px] px-[13px] py-px rounded-[3.35544e+07px] top-0 w-[100.234px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">AirPods Pro</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[6px] h-[32px] items-center justify-center left-[695.05px] px-[13px] py-px rounded-[3.35544e+07px] top-0 w-[108.719px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">PlayStation 5</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[32px] left-0 top-[410px] w-[896px]" data-name="Container">
      <Text2 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[448.16px] text-[#717182] text-[16px] text-center text-nowrap top-[-2px] translate-x-[-50%] whitespace-pre">Browse by Category</p>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1adf7700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 18H12.01" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage() {
  return (
    <div className="basis-0 bg-[#2b7fff] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon3 />
      </div>
    </div>
  );
}

function HomePage1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[45.156px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[45.156px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Phones</p>
      </div>
    </div>
  );
}

function CardContent() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage />
        <HomePage1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="[grid-area:1_/_1] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3b60e6c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M20.054 15.987H3.946" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage2() {
  return (
    <div className="basis-0 bg-[#ad46ff] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon4 />
      </div>
    </div>
  );
}

function HomePage3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[49.063px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[49.063px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Laptops</p>
      </div>
    </div>
  );
}

function CardContent1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage2 />
        <HomePage3 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="[grid-area:1_/_2] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent1 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p2ebe5280} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M8 21H16" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 17V21" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage4() {
  return (
    <div className="basis-0 bg-[#00c950] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon5 />
      </div>
    </div>
  );
}

function HomePage5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65.797px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[65.797px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Electronics</p>
      </div>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage4 />
        <HomePage5 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="[grid-area:1_/_3] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent2 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p16b88f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage6() {
  return (
    <div className="basis-0 bg-[#ff6900] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon6 />
      </div>
    </div>
  );
}

function HomePage7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36.797px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[36.797px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Audio</p>
      </div>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage6 />
        <HomePage7 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="[grid-area:1_/_4] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent3 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1b108500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p16b88f0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage8() {
  return (
    <div className="basis-0 bg-[#f6339a] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon7 />
      </div>
    </div>
  );
}

function HomePage9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.109px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[53.109px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Cameras</p>
      </div>
    </div>
  );
}

function CardContent4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage8 />
        <HomePage9 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="[grid-area:1_/_5] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent4 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 10V12.2L13.6 13.2" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.peb59000} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pce04680} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3c6311f0} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function HomePage10() {
  return (
    <div className="basis-0 bg-[#00b8db] grow min-h-px min-w-px relative rounded-[14px] shrink-0 w-[48px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-full items-center justify-center relative w-[48px]">
        <Icon8 />
      </div>
    </div>
  );
}

function HomePage11() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.859px]" data-name="HomePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-start relative w-[63.859px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-center text-neutral-950 text-nowrap whitespace-pre">Wearables</p>
      </div>
    </div>
  );
}

function CardContent5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[134px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[12px] h-full items-center px-0 py-[24px] relative w-[134px]">
        <HomePage10 />
        <HomePage11 />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="[grid-area:1_/_6] bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[14px] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <CardContent5 />
    </div>
  );
}

function Container10() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(6,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[130px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Card4 />
      <Card5 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[24px] h-[210px] items-start left-0 pb-0 pt-[32px] px-0 top-[474px] w-[896px]" data-name="Container">
      <Heading1 />
      <Container10 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-[101.8px] text-[30px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">500+</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Retailers</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-0 top-[48px] w-[202.656px]" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-[101.52px] text-[30px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">1M+</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Products</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-[234.66px] top-[48px] w-[202.672px]" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-[101.25px] text-[30px] text-center text-neutral-950 text-nowrap top-[-3px] translate-x-[-50%] whitespace-pre">$200M+</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Saved</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[60px] items-start left-[469.33px] top-[48px] w-[202.672px]" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[108px] left-[112px] top-[716px] w-[672px]" data-name="Container">
      <Container14 />
      <Container17 />
      <Container20 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute h-[824px] left-[318.5px] top-[153px] w-[896px]" data-name="Main Content">
      <Container5 />
      <Container6 />
      <Form />
      <Container9 />
      <Container11 />
      <Container21 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">© 2025 PriceRadar. All rights reserved.</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[85px] items-start left-0 pb-0 pt-[33px] px-[16px] top-[1057px] w-[1533px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph1 />
    </div>
  );
}

export default function WritingToolWithChapters() {
  return (
    <div className="bg-white relative size-full" data-name="Writing Tool with Chapters">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}