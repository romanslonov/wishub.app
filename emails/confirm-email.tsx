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

interface Props {
  code: string;
}

export const ConfirmEmailTemplate = ({ code }: Props) => {
  const previewText = `Confirm email on Wishub`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Confirm email on <strong>Wishub</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Paste code below in confirmation form:
            </Text>
            <Section className="text-center bg-neutral-100 py-6 px-3">
              <Text className="font-mono font-bold align-middle text-2xl">
                {code}
              </Text>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This email was sent automatically by wishub.app because your
              registered account. If you didn&apos;t, there&apos;s nothing to
              worry about, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ConfirmEmailTemplate.PreviewProps = {
  code: "918328",
} satisfies Props;

export default ConfirmEmailTemplate;
