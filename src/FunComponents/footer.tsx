export default function Footer() {
  return (
    <footer className="bg-[#5f7f45] text-white">
      <div className="max-w-370 mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div>
            <h4 className="font-semibold mb-6">Category</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>Porcelain</li>
              <li>Old Clocks</li>
              <li>Jewelry</li>
              <li>Manuscripts</li>
              <li>Ceramics</li>
              <li>Furniture</li>
              <li>Instruments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>How to bid with us</li>
              <li>How to sell with us</li>
              <li>About Us</li>
              <li>F.A.Q</li>
              <li>Our Brand</li>
            </ul>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-wide mb-2">
              PROBID
            </h2>
            <p className="text-xs text-white/70 mb-6">
              Bid High, Win Big, Smile Bigger
            </p>

            <p className="font-semibold mb-1">
              Social Just You Connected Us!
            </p>
            <p className="text-xs text-white/70 mb-4">
              All of update in social
            </p>

            <div className="flex justify-center gap-4 text-white">
              <span className="cursor-pointer">in</span>
              <span className="cursor-pointer">f</span>
              <span className="cursor-pointer">x</span>
              <span className="cursor-pointer">◎</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">
              Join Our Newsletter & <br /> More information.
            </h4>

            <div className="flex items-center border border-white/40 rounded-md overflow-hidden mb-6">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent px-4 py-2 text-sm w-full placeholder:text-white/60 focus:outline-none"
              />
              <button className="px-4 text-lg">→</button>
            </div>

            <p className="text-sm font-semibold mb-3">
              Secured Payment Gateways
            </p>

            <div className="bg-white rounded-md p-2 inline-flex gap-2">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9yuQz-NLmiaNVbUTA_-2jf8HIhyd-iO-OLw&s" alt="visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="mc" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="amex" className="h-6" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrWHebRtvOTxy4VPYjaabCPS6ANzDGowQvuQ&s" alt="discover" className="h-6" />
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-370 mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-xs text-white/70 gap-3">
          <p>© Copyright 2024 Probid | Design By Egens Lab</p>

          <div className="flex gap-6">
            <span>Support Center</span>
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
