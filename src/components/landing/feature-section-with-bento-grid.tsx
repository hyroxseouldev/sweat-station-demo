import { Users, Video, Calendar, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Animation variants for stagger effect
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

function Feature() {
  return (
    <motion.div
      className="w-full py-20 lg:py-40"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-center text-center">
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge>스마트 관리</Badge>
              </motion.div>
            </motion.div>
            <div className="flex gap-2 flex-col">
              <motion.h2
                className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-center"
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                체육관 운영이 이렇게 쉬워도 되나요?
              </motion.h2>
              <motion.p
                className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-center mx-auto"
                variants={itemVariants}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                복잡한 관리 업무를 자동화하고, 회원들과의 소통을 원활하게 만드는
                올인원 솔루션입니다.
              </motion.p>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.6,
                },
              },
            }}
          >
            {/* 회원 관리 시스템 - Large Card */}
            <motion.div
              className="bg-muted border border-border/20 shadow-sm rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col"
              variants={cardVariants}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-8 h-8 stroke-1" />
              </motion.div>
              <div className="flex flex-col">
                <motion.h3
                  className="text-xl tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  회원 관리 시스템
                </motion.h3>
                <motion.p
                  className="text-muted-foreground max-w-xs text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  등록부터 결제까지, 모든 회원 정보를 한 곳에서 체계적으로
                  관리하고 실시간으로 추적할 수 있습니다.
                </motion.p>
              </div>
            </motion.div>

            {/* 운동 프로그램 - Small Card */}
            <motion.div
              className="bg-muted border border-border/20 shadow-sm rounded-md aspect-square p-6 flex justify-between flex-col"
              variants={cardVariants}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Video className="w-8 h-8 stroke-1" />
              </motion.div>
              <div className="flex flex-col">
                <motion.h3
                  className="text-xl tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  운동 프로그램
                </motion.h3>
                <motion.p
                  className="text-muted-foreground max-w-xs text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  개인별 맞춤 운동 계획과 영상을 제공하여 효과적인 트레이닝을
                  지원합니다.
                </motion.p>
              </div>
            </motion.div>

            {/* 일정 관리 - Small Card */}
            <motion.div
              className="bg-muted border border-border/20 shadow-sm rounded-md aspect-square p-6 flex justify-between flex-col"
              variants={cardVariants}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Calendar className="w-8 h-8 stroke-1" />
              </motion.div>
              <div className="flex flex-col">
                <motion.h3
                  className="text-xl tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  일정 관리
                </motion.h3>
                <motion.p
                  className="text-muted-foreground max-w-xs text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                >
                  수업 스케줄링부터 개인 PT까지, 모든 일정을 효율적으로
                  관리하세요.
                </motion.p>
              </div>
            </motion.div>

            {/* 실시간 분석 대시보드 - Large Card */}
            <motion.div
              className="bg-muted border border-border/20 shadow-sm rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col"
              variants={cardVariants}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: -3 }}
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  rotate: { type: "spring", stiffness: 300 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <BarChart3 className="w-8 h-8 stroke-1" />
              </motion.div>
              <div className="flex flex-col">
                <motion.h3
                  className="text-xl tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  실시간 분석 대시보드
                </motion.h3>
                <motion.p
                  className="text-muted-foreground max-w-xs text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  매출, 회원 증가율, 수업 참여도 등 핵심 지표를 한눈에 파악하고
                  데이터 기반 의사결정을 내리세요.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export { Feature };
