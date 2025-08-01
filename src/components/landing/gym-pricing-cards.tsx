import { Check, MoveRight, PhoneCall, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const gymPricingPlans = [
  {
    name: "스타터",
    price: "29,000",
    description: "소규모 체육관을 위한 기본적인 회원관리 솔루션입니다.",
    popular: false,
    features: [
      {
        title: "회원 50명까지 관리",
        description: "최대 50명의 회원을 체계적으로 관리할 수 있습니다.",
      },
      {
        title: "기본 운동 프로그램 3개",
        description: "검증된 기본 운동 프로그램을 제공합니다.",
      },
      {
        title: "기본 대시보드",
        description: "체육관 운영 현황을 한눈에 확인하세요.",
      },
      {
        title: "이메일 지원",
        description: "이메일을 통한 고객 지원을 받으실 수 있습니다.",
      },
      {
        title: "모바일 앱 접근",
        description: "언제 어디서나 모바일로 관리할 수 있습니다.",
      },
    ],
  },
  {
    name: "프로페셔널",
    price: "79,000",
    description: "중규모 체육관을 위한 완전한 회원관리 패키지입니다.",
    popular: true,
    features: [
      {
        title: "회원 200명까지 관리",
        description: "최대 200명의 회원을 효율적으로 관리하세요.",
      },
      {
        title: "맞춤형 운동 프로그램 무제한",
        description: "회원별 개인 맞춤 프로그램을 무제한 생성하세요.",
      },
      {
        title: "고급 분석 대시보드",
        description: "상세한 분석과 인사이트를 제공합니다.",
      },
      {
        title: "우선 전화/채팅 지원",
        description: "우선적으로 전화와 채팅 지원을 받으세요.",
      },
      {
        title: "모바일 앱 + 웹 접근",
        description: "모바일과 웹에서 모든 기능을 사용하세요.",
      },
      {
        title: "자동 결제 시스템",
        description: "회원 결제를 자동으로 관리할 수 있습니다.",
      },
      {
        title: "회원 출입 관리",
        description: "QR코드 등으로 출입을 체계적으로 관리하세요.",
      },
    ],
  },
  {
    name: "비즈니스",
    price: "199,000",
    description: "대규모 체육관과 체인점을 위한 프리미엄 솔루션입니다.",
    popular: false,
    features: [
      {
        title: "무제한 회원 관리",
        description: "회원 수 제한 없이 무제한으로 관리하세요.",
      },
      {
        title: "모든 운동 프로그램 + 맞춤 제작",
        description: "모든 프로그램과 맞춤 제작 서비스를 제공합니다.",
      },
      {
        title: "프리미엄 분석 및 리포트",
        description: "고급 분석과 상세한 리포트를 받아보세요.",
      },
      {
        title: "24/7 전담 지원",
        description: "24시간 전담 지원팀이 도와드립니다.",
      },
      {
        title: "다중 지점 관리",
        description: "여러 체육관을 하나의 시스템으로 관리하세요.",
      },
      {
        title: "API 연동 지원",
        description: "기존 시스템과의 연동을 지원합니다.",
      },
      {
        title: "전문 컨설팅 서비스",
        description: "체육관 운영 전문가의 컨설팅을 받으세요.",
      },
      {
        title: "직원 권한 관리 시스템",
        description: "직원별 접근 권한을 세밀하게 관리할 수 있습니다.",
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

function GymPricing() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="flex text-center justify-center items-center gap-4 flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={textVariants}>
            <Badge>요금제</Badge>
          </motion.div>
          <motion.div className="flex gap-2 flex-col" variants={textVariants}>
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              합리적인 가격으로 시작하세요
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              체육관 규모에 맞는 최적의 요금제를 선택하세요. 언제든지 플랜을
              변경할 수 있습니다.
            </p>
          </motion.div>
          <motion.div
            className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8"
            variants={containerVariants}
          >
            {gymPricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
              >
                <Card
                  className={`w-full rounded-md relative h-full flex flex-col ${
                    plan.popular ? "shadow-2xl border-2 border-primary" : ""
                  }`}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        가장 인기
                      </Badge>
                    </motion.div>
                  )}
                  <CardHeader>
                    <CardTitle>
                      <span className="flex flex-row gap-4 items-center font-normal text-2xl">
                        {plan.name}
                      </span>
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="flex flex-col gap-8 justify-start flex-1">
                      <p className="flex flex-row items-center gap-2 text-xl">
                        <span className="text-4xl font-bold">
                          ₩{plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / 월
                        </span>
                      </p>
                      <div className="flex flex-col gap-4 justify-start flex-1">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex flex-row gap-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: featureIndex * 0.1 }}
                          >
                            <Check className="w-4 h-4 mt-2 text-primary flex-shrink-0" />
                            <div className="flex flex-col">
                              <p className="font-medium">{feature.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-auto">
                        {plan.name === "비즈니스" ? (
                          <Button variant="outline" className="gap-4 w-full">
                            상담 예약하기 <PhoneCall className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            className={`gap-4 w-full ${
                              plan.popular ? "" : "variant-outline"
                            }`}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.name} 시작하기{" "}
                            <MoveRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export { GymPricing };
