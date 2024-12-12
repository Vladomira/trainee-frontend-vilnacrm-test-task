import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import FormComponent from '@/components/Form';
import fetchUser from '@/services/userService/fetchUser';
import { FormFieldsData } from '@/types/Form';

export const getServerSideProps = (async () => {
  const result = await fetchUser(1);
  const { name, email, phone, address } = result;

  const { city, street, suite } = address;
  const user = {
    name,
    email,
    phone: phone.split('x')[0].trim(),
    address: `${street}, ${suite}, ${city}`,
  };
  return { props: { user } };
}) satisfies GetServerSideProps<{ user: FormFieldsData }>;

export default function Home({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Head>
        <title>Frontend SSR template</title>
        <meta
          name="description"
          content="Frontend SSR template is used for bootstrapping a project."
        />
      </Head>
      <Box sx={{ width: '100%', padding: '30px 0px 0px' }}>
        <Typography variant="h3" align="center">
          Frontend SSR template
        </Typography>

        <FormComponent user={user} />
      </Box>
    </div>
  );
}
