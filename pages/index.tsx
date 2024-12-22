import Head from 'next/head';
import React from 'react';

import Form from '@/components/Form/Form';

export default function Home() {

  return (
    <div>
      <Head>
        <title>Frontend SSR template</title>
        <meta
          name="description"
          content="Frontend SSR template is used for bootstrapping a project."
        />
      </Head>
      <Form />
    </div>
  );
}
