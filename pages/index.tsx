import Typography from '@mui/material/Typography';
import { User } from '@sentry/react';
import Head from 'next/head';
import React from 'react';

import FormComponent from '@/components/Form';
import fetchUser from '@/services/userService/fetchUser';

export default function Home({ user }: User) {
  return (
    <div>
      <Head>
        <title>Frontend SSR template</title>
        <meta
          name="description"
          content="Frontend SSR template is used for bootstrapping a project."
        />
      </Head>
      <Typography variant="h5" align="center" sx={{ padding: '30px 0px' }}>
        Frontend SSR template
      </Typography>

      <FormComponent user={user} />
    </div>
  );
}
export async function getStaticProps() {
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
}
