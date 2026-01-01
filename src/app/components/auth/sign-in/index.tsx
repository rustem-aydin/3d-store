"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";

// --- ANIMASYON BİLEŞENLERİ (Değişmedi) ---
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(
      Math.sqrt(deltaX ** 2 + deltaY ** 2),
      maxDistance
    );
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();
  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(
      Math.sqrt(deltaX ** 2 + deltaY ** 2),
      maxDistance
    );
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animasyon State'leri
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  // Mouse Takibi
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Göz Kırpma Efektleri
  useEffect(() => {
    const scheduleBlink = (setBlink: any) => {
      const timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          scheduleBlink(setBlink);
        }, 150);
      }, Math.random() * 4000 + 3000);
      return timeout;
    };
    const t1 = scheduleBlink(setIsPurpleBlinking);
    const t2 = scheduleBlink(setIsBlackBlinking);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Yazarken birbirlerine bakma
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Şifre girerken mor karakterin gizlice bakması
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const timeout = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return timeout;
      };
      const t = schedulePeek();
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword]);

  // Pozisyon Hesaplama
  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    return {
      faceX: Math.max(-15, Math.min(15, deltaX / 20)),
      faceY: Math.max(-10, Math.min(10, deltaY / 30)),
      bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
    };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    alert("Login işlemi başarılı!");
  };

  return (
    <div className="mt-20 grid  lg:grid-cols-2">
      {/* SOL: Sadece Animasyon (Logo ve Footer kaldırıldı) */}
      <div className="relative hidden lg:flex flex-col items-center justify-center  overflow-hidden">
        {/* ANIMASYON ALANI */}
        <div
          className="relative flex items-end justify-center"
          style={{ width: "550px", height: "400px" }}
        >
          {/* Mor Karakter */}
          <div
            ref={purpleRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "70px",
              width: "180px",
              height:
                isTyping || (password.length > 0 && !showPassword)
                  ? "440px"
                  : "400px",
              backgroundColor: "#7c3aed",
              borderRadius: "10px 10px 0 0",
              zIndex: 1, // Renk biraz daha koyu mor
              transform: `skewX(${
                password.length > 0 && showPassword
                  ? 0
                  : isTyping || (password.length > 0 && !showPassword)
                  ? purplePos.bodySkew - 12
                  : purplePos.bodySkew
              }deg) translateX(${
                isTyping || (password.length > 0 && !showPassword) ? 40 : 0
              }px)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-8 transition-all duration-700 ease-in-out"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? "20px"
                    : isLookingAtEachOther
                    ? "55px"
                    : `${45 + purplePos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? "35px"
                    : isLookingAtEachOther
                    ? "65px"
                    : `${40 + purplePos.faceY}px`,
              }}
            >
              <EyeBall
                size={18}
                pupilSize={7}
                maxDistance={5}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 4
                      : -4
                    : isLookingAtEachOther
                    ? 3
                    : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 5
                      : -4
                    : isLookingAtEachOther
                    ? 4
                    : undefined
                }
              />
              <EyeBall
                size={18}
                pupilSize={7}
                maxDistance={5}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isPurpleBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 4
                      : -4
                    : isLookingAtEachOther
                    ? 3
                    : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? isPurplePeeking
                      ? 5
                      : -4
                    : isLookingAtEachOther
                    ? 4
                    : undefined
                }
              />
            </div>
          </div>

          {/* Siyah Karakter */}
          <div
            ref={blackRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "240px",
              width: "120px",
              height: "310px",
              backgroundColor: "#2D2D2D",
              borderRadius: "8px 8px 0 0",
              zIndex: 2,
              transform: `skewX(${
                isLookingAtEachOther
                  ? blackPos.bodySkew * 1.5 + 10
                  : blackPos.bodySkew
              }deg) translateX(${isLookingAtEachOther ? 20 : 0}px)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-6 transition-all duration-700 ease-in-out"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? "10px"
                    : isLookingAtEachOther
                    ? "32px"
                    : `${26 + blackPos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? "28px"
                    : isLookingAtEachOther
                    ? "12px"
                    : `${32 + blackPos.faceY}px`,
              }}
            >
              <EyeBall
                size={16}
                pupilSize={6}
                maxDistance={4}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                    ? 0
                    : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                    ? -4
                    : undefined
                }
              />
              <EyeBall
                size={16}
                pupilSize={6}
                maxDistance={4}
                eyeColor="white"
                pupilColor="#2D2D2D"
                isBlinking={isBlackBlinking}
                forceLookX={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                    ? 0
                    : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword
                    ? -4
                    : isLookingAtEachOther
                    ? -4
                    : undefined
                }
              />
            </div>
          </div>

          {/* Turuncu/Krem Karakter (Soldaki) */}
          <div
            ref={orangeRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "0px",
              width: "240px",
              height: "200px",
              zIndex: 3,
              backgroundColor: "#fef08a",
              borderRadius: "120px 120px 0 0", // Sarımtırak krem
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : `skewX(${orangePos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-8 transition-all duration-200 ease-out"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? "50px"
                    : `${82 + orangePos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? "85px"
                    : `${90 + orangePos.faceY}px`,
              }}
            >
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={
                  password.length > 0 && showPassword ? -5 : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword ? -4 : undefined
                }
              />
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={
                  password.length > 0 && showPassword ? -5 : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword ? -4 : undefined
                }
              />
            </div>
          </div>

          {/* Sarı Karakter (Sağdaki) */}
          <div
            ref={yellowRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: "310px",
              width: "140px",
              height: "230px",
              backgroundColor: "#fef08a",
              borderRadius: "70px 70px 0 0",
              zIndex: 4, // Sarımtırak krem
              transform:
                password.length > 0 && showPassword
                  ? `skewX(0deg)`
                  : `skewX(${yellowPos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="absolute flex gap-6 transition-all duration-200 ease-out"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? "20px"
                    : `${52 + yellowPos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? "35px"
                    : `${40 + yellowPos.faceY}px`,
              }}
            >
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={
                  password.length > 0 && showPassword ? -5 : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword ? -4 : undefined
                }
              />
              <Pupil
                size={12}
                maxDistance={5}
                pupilColor="#2D2D2D"
                forceLookX={
                  password.length > 0 && showPassword ? -5 : undefined
                }
                forceLookY={
                  password.length > 0 && showPassword ? -4 : undefined
                }
              />
            </div>
            <div
              className="absolute w-20 h-[4px]  rounded-full transition-all duration-200 ease-out"
              style={{
                left:
                  password.length > 0 && showPassword
                    ? "10px"
                    : `${40 + yellowPos.faceX}px`,
                top:
                  password.length > 0 && showPassword
                    ? "88px"
                    : `${88 + yellowPos.faceY}px`,
              }}
            />
          </div>
        </div>

        {/* Arka Plan Süsleri - Daha sade */}
        <div className="absolute top-1/4 right-1/4 size-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* SAĞ: Login Formu (Logo ve Footer yok) */}
      <div className="flex items-center justify-center p-8  text-zinc-900 dark:text-zinc-100">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Giriş Yapınız
            </h1>
            <p className="text-zinc-500 text-sm">Lütfen Formu Doldurunuz</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                E-posta
              </label>
              <input
                id="email"
                type="email"
                placeholder="anna@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                className="flex h-12 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#a855f7]"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  className="flex h-12 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#a855f7] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#a855f7] disabled:pointer-events-none disabled:opacity-50 bg-purple-500 text-white shadow hover:bg-[#a855f7]/90 h-12 w-full text-base"
            >
              {loading ? <Loader2 className="animate-spin size-5" /> : "Log in"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 cursor-pointer disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-transparent shadow-sm hover:border-purple-500 h-12 w-full"
            >
              <Mail className="mr-2 hover:border-purple-500  size-5" />
              Google ile Giriş Yap
            </button>
          </div>

          <div className="text-center text-sm text-zinc-500 mt-8">
            Hesabınız Yok Mu?{" "}
            <a href="#" className=" font-medium hover:underline">
              Kayıt Ol
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
