import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { LocaleData } from "~/locales";
import locale from "../app/locales/en.json";

interface Props {
  code: string;
  t: LocaleData;
}

export const ConfirmEmailTemplate = ({ code, t }: Props) => {
  const previewText = `${t.emails.confirm_email.title} Wishub`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {t.emails.confirm_email.title} <strong>Wishub</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              {t.emails.confirm_email.welcome},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {t.emails.confirm_email.description}:
            </Text>
            <Section className="text-center bg-neutral-100 py-6 px-3">
              <Text className="font-mono font-bold align-middle text-2xl">
                {code}
              </Text>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              {t.emails.confirm_email.comment}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ConfirmEmailTemplate.PreviewProps = {
  code: "918328",
  t: locale,
} satisfies Props;

export default ConfirmEmailTemplate;
