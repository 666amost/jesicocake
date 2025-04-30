import { Metadata } from 'next';
import ToppingForm from './topping-form';

export const metadata: Metadata = {
  title: 'Edit Topping',
};

export async function generateStaticParams() {
  return [];
    }

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
  }
  
export default async function Page({ params }: Props) {
  return <ToppingForm id={params.id} />;
}