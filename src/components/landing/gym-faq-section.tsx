import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const gymFaqs = [
  {
    question: "회원 등록은 어떻게 하나요?",
    answer:
      "간단한 3단계로 회원을 등록할 수 있습니다. 기본 정보 입력, 운동 목표 설정, 그리고 멤버십 선택만 하시면 됩니다. 모든 과정이 3분 이내에 완료됩니다.",
  },
  {
    question: "몇 명의 회원까지 관리할 수 있나요?",
    answer:
      "요금제에 따라 다릅니다. 스타터 플랜은 50명, 프로페셔널 플랜은 200명, 비즈니스 플랜은 무제한으로 회원을 관리할 수 있습니다.",
  },
  {
    question: "운동 프로그램을 커스터마이징할 수 있나요?",
    answer:
      "네, 가능합니다. 회원별 개인 맞춤 운동 프로그램을 생성하고 수정할 수 있으며, 트레이너가 직접 운동 영상과 설명을 추가할 수 있습니다.",
  },
  {
    question: "데이터 백업은 얼마나 자주 이루어지나요?",
    answer:
      "모든 데이터는 실시간으로 클라우드에 백업되며, 추가로 매일 자동 백업이 수행됩니다. 데이터 손실에 대한 걱정 없이 안전하게 사용하실 수 있습니다.",
  },
  {
    question: "모바일 앱도 제공되나요?",
    answer:
      "네, iOS와 Android 모바일 앱을 모두 제공합니다. 언제 어디서나 회원 관리, 스케줄 확인, 출입 관리 등 모든 기능을 사용할 수 있습니다.",
  },
  {
    question: "기존 회원 데이터를 이전할 수 있나요?",
    answer:
      "CSV, Excel 파일 등 다양한 형태의 기존 데이터를 쉽게 가져올 수 있습니다. 전담 지원팀이 데이터 이전 과정을 도와드립니다.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

function GymFAQ() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            className="flex gap-10 flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <div className="flex gap-4 flex-col">
              <motion.div variants={itemVariants}>
                <Badge variant="outline">자주 묻는 질문</Badge>
              </motion.div>
              <motion.div
                className="flex gap-2 flex-col"
                variants={textVariants}
              >
                <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  궁금한 것들이 있으신가요?
                </h4>
                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                  Sweat Station에 대해 가장 많이 문의하시는 질문들을
                  정리했습니다. 더 자세한 정보가 필요하시면 언제든 문의해
                  주세요.
                </p>
              </motion.div>
              {/* <div className="">
                <Button className="gap-4" variant="outline">
                  더 궁금한 점이 있으신가요? 문의하기{" "}
                  <PhoneCall className="w-4 h-4" />
                </Button>
              </div> */}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Accordion type="single" collapsible className="w-full">
              {gymFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <AccordionItem value={"index-" + index}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { GymFAQ };
