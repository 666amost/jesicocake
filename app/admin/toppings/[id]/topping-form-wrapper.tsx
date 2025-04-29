'use client';

import { use } from 'react';
import ToppingForm from './topping-form';

interface ToppingFormWrapperProps {
  params: { id: string };
}

export default function ToppingFormWrapper({ params }: ToppingFormWrapperProps) {
  return <ToppingForm id={params.id} />;
} 