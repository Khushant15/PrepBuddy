import { accentureQuestions } from "./accenture"
import { capgeminiQuestions } from "./capgemini"
import { ciscoQuestions } from "./cisco"
import { cognizantQuestions } from "./cognizant"
import { deloitteQuestions } from "./deloitte"
import { flipkartQuestions } from "./flipkart"
import { tcsQuestions } from "./tcs"
import { wiproQuestions } from "./wipro"

export const companyQuestionMap: Record<string, any> = {
  tcs: tcsQuestions,
  wipro: wiproQuestions,
  accenture: accentureQuestions,
  capgemini: capgeminiQuestions,
  cognizant: cognizantQuestions,
  deloitte: deloitteQuestions,
  cisco: ciscoQuestions,
  flipkart: flipkartQuestions,
}

export const companies = Object.keys(companyQuestionMap)