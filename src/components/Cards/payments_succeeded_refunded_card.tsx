import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import NumberCircleColor from "@/components/Containers/number_circle_color";
import {useTranslations} from 'next-intl';

type PaymentSuceededRefundedCardProps = {
  title: string;
  acceptedAmount: number;
  refundedAmount: number;
};

const PaymentSuceededRefundedCard: React.FC<PaymentSuceededRefundedCardProps> = ({ title, acceptedAmount, refundedAmount}) => {
  const t = useTranslations('MyDashboard');
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => resizeObserver.disconnect(); // Clean up
  }, []);
  const titleSize = cardWidth / 20
  const minTitleSize = cardWidth / 24;
  const maxTitleSize = cardWidth / 16;

  const subtitleSize = titleSize * 0.8
  const minSubtitleSize = minTitleSize * 0.8
  const maxSubtitleSize = maxTitleSize * 0.8

  const numberSize = cardWidth / 18
  const minNumberSize = cardWidth / 22
  const maxNumberSize = cardWidth / 14
  const unit = "€"
  return (
    <Card
      ref={cardRef}
      className="w-full h-full cursor-default shadow-none bg-white dark:bg-darkGray p-2"
      style={{ borderRadius: 35 }}
    >
      <CardBody className="w-full h-full flex flex-col p-0 m-0">
        <div className="w-full h-fit flex text-center items-center font-semibold overflow-hidden line-clamp-2 py-3 pl-3"
          style={{fontSize: `clamp(${minTitleSize}px, ${titleSize}px, ${maxTitleSize}px)`}}>
          {title}
        </div>
        <div className="w-full h-full flex flex-row items-center">
          <div className="w-1/2 h-full pl-3">
            <NumberCircleColor 
              title={t('succeeded')}
              value={parseFloat(acceptedAmount.toFixed(2))}
              subtitleSize={subtitleSize}
              minSubtitleSize={minSubtitleSize}
              maxSubtitleSize={maxSubtitleSize}
              numberSize={numberSize}
              minNumberSize={minNumberSize}
              maxNumberSize={maxNumberSize}
              unit={unit}
              circleColor='#25aae1'
            />
          </div>
          <div className="w-1/2 h-full pl-3">
          <NumberCircleColor 
            title={t('refunded')}
            value={parseFloat(refundedAmount.toFixed(2))}
            subtitleSize={subtitleSize}
            minSubtitleSize={minSubtitleSize}
            maxSubtitleSize={maxSubtitleSize}
            numberSize={numberSize}
            minNumberSize={minNumberSize}
            maxNumberSize={maxNumberSize}
            unit={unit}
            circleColor='#f7941d'
          />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PaymentSuceededRefundedCard;