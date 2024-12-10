import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FormComponent from '@/components/Form';

export default function Home() {
  const { t } = useTranslation();

  const onClick = () => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('clicked');
    }, 2000);
  };

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
        <Box sx={{ margin: '15px 0px 0px ', textAlign: 'center' }}>
          <Button variant="outlined" size="medium" type="button" onClick={onClick}>
            {t('click')}
          </Button>
        </Box>
        <FormComponent />
      </Box>
    </div>
  );
}
