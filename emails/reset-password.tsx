import {
  Body,
  Button,
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
  link: string;
  t: LocaleData;
}

export const ResetPasswordTemplate = ({ link, t }: Props) => {
  const previewText = `${t.emails.reset_password.title} Wishub`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              {t.emails.reset_password.title}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              {t.emails.reset_password.welcome},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {t.emails.reset_password.description}:
            </Text>
            <Section className="text-center">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={link}
              >
                {t.emails.reset_password.button}
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              {t.emails.reset_password.comment}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordTemplate.PreviewProps = {
  link: "http://localhost:3000/",
  t: locale,
} satisfies Props;

export default ResetPasswordTemplate;
