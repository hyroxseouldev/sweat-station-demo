import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import MainHeader from "@/components/header";
import {
  Dumbbell,
  Users,
  Calendar,
  BarChart3,
  Shield,
  Palette,
  Database,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Clock,
  TrendingUp,
  Award,
  Github,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg animate-pulse">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                피트니스 센터 관리를
              </span>
              <br />
              <span className="text-gray-900">몇 초만에, 몇 시간이 아닌.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              최첨단 스마트 관리 시스템으로 회원부터 매출까지,{" "}
              <span className="font-bold text-blue-600 underline decoration-blue-200 decoration-2">
                복잡함은 저희가 맡겠습니다.
              </span>
            </p>

            <SignedOut>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
                <SignInButton mode="modal">
                  <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-xl font-bold tracking-tight shadow-lg">
                    <span className="flex items-center gap-3">
                      계정 만들기
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </SignInButton>
                <button className="border-2 border-gray-200 text-gray-700 px-10 py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-xl font-semibold shadow-sm">
                  상담 예약하기
                </button>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-12 mb-20 shadow-2xl">
                <div className="flex justify-center mb-8">
                  <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-extrabold text-emerald-800 mb-6">
                  🎉 환영합니다!
                </h2>
                <p className="text-emerald-700 mb-10 text-xl font-medium">
                  성공적으로 로그인되었습니다. 이제 모든 관리 기능을 사용하실 수
                  있습니다.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <UserButton afterSignOutUrl="/" />
                  <a
                    href="/dashboard"
                    className="bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all duration-300 font-bold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    대시보드로 이동
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </SignedIn>

            {/* Process Visualization */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 md:p-16 mb-24 text-white overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <div className="absolute top-8 right-8 opacity-10">
                <Zap className="w-32 h-32" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                관리가 쉬워졌습니다
              </h2>
              <p className="text-gray-300 text-center mb-16 text-xl">
                복잡함은 저희에게 맡기고, 쉽게 배포하세요.
              </p>

              <div className="grid md:grid-cols-3 gap-12 items-center max-w-6xl mx-auto">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 font-mono text-left border border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="text-green-400 mb-3 text-lg">
                      $ fitness center setup
                    </div>
                    <div className="text-gray-300 text-base mb-3">
                      센터 정보 등록 중...
                    </div>
                    <div className="text-blue-400 text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      기본 설정 완료
                    </div>
                  </div>
                  <div className="text-gray-300 font-bold text-lg">
                    센터 등록
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 font-mono text-left border border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="text-green-400 mb-3 text-lg">
                      $ member register
                    </div>
                    <div className="text-gray-300 text-base mb-3">
                      회원 데이터 동기화 중...
                    </div>
                    <div className="text-purple-400 text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      회원 관리 활성화
                    </div>
                  </div>
                  <div className="text-gray-300 font-bold text-lg">
                    회원 등록
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-6 font-mono text-left border border-gray-600 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="text-green-400 mb-3 text-lg">
                      $ center deploy
                    </div>
                    <div className="text-gray-300 text-base mb-3">
                      서비스 배포 중...
                    </div>
                    <div className="text-yellow-400 text-lg flex items-center gap-2">
                      <span>센터 운영 중</span>
                      <span className="text-3xl">✨</span>
                    </div>
                  </div>
                  <div className="text-gray-300 font-bold text-lg">
                    실시간 운영
                  </div>
                </div>
              </div>
            </div>

            {/* Core Features */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  강력한 기능들
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  피트니스 센터 운영에 필요한 모든 것을 하나의 플랫폼에서
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <Zap className="w-16 h-16 text-blue-600 mb-8" />
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      원클릭 배포
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      몇 초 만에 센터 시스템을 배포할 수 있는 원클릭 배포 기능
                    </p>
                  </div>
                </div>

                <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <Calendar className="w-16 h-16 text-purple-600 mb-8" />
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      직관적인 워크플로우
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      복잡한 단계 없이 직관적인 워크플로우로 센터를 쉽게 관리
                    </p>
                    <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                      <div className="text-sm text-purple-600 mb-2 font-semibold">
                        대시보드 진행률
                      </div>
                      <div className="w-full bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full shadow-inner"></div>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <TrendingUp className="w-16 h-16 text-green-600 mb-8" />
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      엣지 호스팅
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      엣지 네트워크로 각 도시별로 직접 방문하여 센터를 호스팅
                    </p>
                  </div>
                </div>

                <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <Clock className="w-16 h-16 text-red-600 mb-8" />
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      콘텐츠 생성
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      센터 홍보 콘텐츠가 부족하시면 저희가 대신 생성해드립니다
                    </p>
                    <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl">
                      <div className="text-sm text-red-600 mb-2 font-semibold">
                        생성 진행률
                      </div>
                      <div className="w-full bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full shadow-inner"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  전문가를 위한 간단한 가격
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  더 많은 기능과 유연성이 필요한 전문가를 위한 요금제입니다
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Hobby Plan */}
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 relative">
                  <h3 className="text-3xl font-bold mb-8 text-gray-800">
                    취미
                  </h3>
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-6xl font-bold text-gray-900">
                        99
                      </span>
                      <span className="text-2xl text-gray-500 ml-3">/월</span>
                    </div>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-800 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 text-lg mb-10">
                    취미 플랜 선택
                  </button>
                  <ul className="space-y-5">
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        기본 분석 리포트 접근
                      </span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        월 10,000개 데이터 포인트
                      </span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">이메일 지원</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">커뮤니티 포럼 접근</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">언제든 해지 가능</span>
                    </li>
                  </ul>
                </div>

                {/* Starter Plan - Featured */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 shadow-2xl text-white transform scale-105 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-2xl text-base font-bold shadow-lg">
                    🌟 추천
                  </div>
                  <h3 className="text-3xl font-bold mb-8">스타터</h3>
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-6xl font-bold">299</span>
                      <span className="text-2xl text-blue-200 ml-3">/월</span>
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 text-lg mb-10 shadow-lg">
                    스타터 플랜 선택
                  </button>
                  <ul className="space-y-5">
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                      <span>고급 분석 대시보드</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                      <span>맞춤형 리포트 및 차트</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                      <span>실시간 데이터 추적</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                      <span>외부 도구 통합</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                      <span>취미 플랜의 모든 기능</span>
                    </li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 relative">
                  <h3 className="text-3xl font-bold mb-8 text-gray-800">
                    프로
                  </h3>
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-6xl font-bold text-gray-900">
                        1490
                      </span>
                      <span className="text-2xl text-gray-500 ml-3">/월</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-4 rounded-2xl font-bold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 text-lg mb-10 shadow-lg">
                    프로 플랜 선택
                  </button>
                  <ul className="space-y-5">
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">무제한 데이터 저장</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">맞춤형 대시보드</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">고급 데이터 세분화</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">실시간 데이터 처리</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        AI 기반 인사이트 및 추천
                      </span>
                    </li>
                    <li className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">
                        취미 + 스타터 플랜 모든 기능
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Final CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 md:p-20 text-white text-center mb-24 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  제로 마찰로
                  <br />
                  오늘 바로 센터를 호스팅하세요.
                </h2>
                <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto font-medium leading-relaxed">
                  탁월한 안정성과 함께 초고속 호스팅을 경험하세요. 최첨단
                  인프라로 24/7 온라인 상태를 유지하며, 99.9% 가동률을
                  보장합니다.
                </p>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-12 opacity-70">
                  {["JD", "RJ", "JS", "ED", "TD", "DO"].map(
                    (initials, index) => (
                      <div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                      >
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                          {initials}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <p className="text-blue-200 mb-12 text-xl font-semibold">
                  27,000명 이상의 개발자들이 신뢰합니다
                </p>

                <SignInButton mode="modal">
                  <button className="bg-white text-blue-600 px-12 py-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105">
                    상담 예약하기
                  </button>
                </SignInButton>
              </div>
            </div>

            {/* Setup Guide */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 border border-gray-200 shadow-xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800 text-center">
                🚀 빠른 시작 가이드
              </h3>
              <div className="grid md:grid-cols-2 gap-12 text-left">
                <div>
                  <h4 className="font-bold text-2xl mb-8 text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    환경 설정
                  </h4>
                  <ul className="space-y-6 text-gray-700">
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg mr-3 mt-1 font-semibold">
                        1
                      </span>
                      <div>
                        <code className="bg-gray-200 px-3 py-2 rounded-lg text-base font-mono">
                          .env.local
                        </code>{" "}
                        <span className="font-medium">
                          파일에 Clerk 환경변수 설정
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg mr-3 mt-1 font-semibold">
                        2
                      </span>
                      <div>
                        <code className="bg-gray-200 px-3 py-2 rounded-lg text-base font-mono">
                          DATABASE_URL
                        </code>
                        <span className="font-medium">
                          로 데이터베이스 연결 설정
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-2xl mb-8 text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    데이터베이스 구성
                  </h4>
                  <ul className="space-y-6 text-gray-700">
                    <li className="flex items-start gap-4">
                      <span className="bg-purple-500 text-white text-sm px-3 py-2 rounded-lg mr-3 mt-1 font-semibold">
                        3
                      </span>
                      <div>
                        <code className="bg-gray-200 px-3 py-2 rounded-lg text-base font-mono">
                          pnpm db:push
                        </code>{" "}
                        <span className="font-medium">
                          명령어로 테이블 생성
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="bg-purple-500 text-white text-sm px-3 py-2 rounded-lg mr-3 mt-1 font-semibold">
                        4
                      </span>
                      <div>
                        <code className="bg-gray-200 px-3 py-2 rounded-lg text-base font-mono">
                          /api/test-db
                        </code>
                        <span className="font-medium">
                          에서 데이터베이스 연결 테스트
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-16 text-center">
                <p className="text-gray-600 mb-8 text-xl font-medium">
                  모든 설정이 완료되면 피트니스 센터 관리를 시작하세요!
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <a
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transition-all duration-500 font-bold text-lg transform hover:scale-105"
                  >
                    대시보드 시작하기
                  </a>
                  <a
                    href="/api/test-db"
                    className="border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-lg"
                  >
                    DB 연결 테스트
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-5 gap-12">
                {/* Logo and Copyright */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                      <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-2xl font-bold">스웨트스테이션</span>
                  </div>
                  <p className="text-gray-400 text-base leading-relaxed">
                    © 스웨트스테이션 2024. 모든 권리 보유.
                  </p>
                </div>

                {/* Pages */}
                <div>
                  <h4 className="font-bold mb-6 text-lg">페이지</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li>
                      <a
                        href="/"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        홈
                      </a>
                    </li>
                    <li>
                      <a
                        href="#features"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        기능
                      </a>
                    </li>
                    <li>
                      <a
                        href="#pricing"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        가격
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contact"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        연락처
                      </a>
                    </li>
                    <li>
                      <a
                        href="/blog"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        블로그
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Socials */}
                <div>
                  <h4 className="font-bold mb-6 text-lg">소셜</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors flex items-center gap-3 hover:underline"
                      >
                        <Instagram className="w-5 h-5" />
                        인스타그램
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors flex items-center gap-3 hover:underline"
                      >
                        <Twitter className="w-5 h-5" />
                        트위터
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors flex items-center gap-3 hover:underline"
                      >
                        <Linkedin className="w-5 h-5" />
                        링크드인
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="font-bold mb-6 text-lg">약관</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li>
                      <a
                        href="/privacy"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        개인정보 처리방침
                      </a>
                    </li>
                    <li>
                      <a
                        href="/terms"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        서비스 이용약관
                      </a>
                    </li>
                    <li>
                      <a
                        href="/cookies"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        쿠키 정책
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Register */}
                <div>
                  <h4 className="font-bold mb-6 text-lg">가입</h4>
                  <ul className="space-y-4 text-gray-400">
                    <li>
                      <SignInButton mode="modal">
                        <button className="hover:text-white transition-colors text-left hover:underline">
                          회원가입
                        </button>
                      </SignInButton>
                    </li>
                    <li>
                      <SignInButton mode="modal">
                        <button className="hover:text-white transition-colors text-left hover:underline">
                          로그인
                        </button>
                      </SignInButton>
                    </li>
                    <li>
                      <a
                        href="#demo"
                        className="hover:text-white transition-colors hover:underline"
                      >
                        데모 예약
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
