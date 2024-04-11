import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createClient } from '@supabase/supabase-js';

import { getSplittedDocs } from '@/utils/langchain/getSplittedDocs';
import { log } from '@/utils/log';

/* Name of directory to retrieve your files from */
const DATA_STORE_PATH = 'data/keywords.txt';

export const run = async () => {
  try {
    const docs = await getSplittedDocs({
      filePath: DATA_STORE_PATH,
      chunkSize: 10,
      chunkOverlap: 4,
    });

    log('🔍 Checking environment variables\n');

    const supabase_api_key = process.env.SUPABASE_API_KEY;
    const sbUrl = process.env.SUPABASE_URL;
    const openAIApiKey = process.env.OPENAI_API_KEY;
    const client = createClient(sbUrl as string, supabase_api_key as string);

    log('🔗 Connecting to Supabase\n');

    // Check if there is any data in the relevant table
    const { data: existingData, error } = await client
      .from('keywords')
      .select('*')
      .limit(1);
    if (error) {
      throw Error('Error fetching data from Supabase:');
    }

    // If data exists, skip the rest of the process
    if (existingData && existingData.length > 0) {
      log('📚 Data already exists in Supabase, skipping process.\n');
      return;
    }

    await SupabaseVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'keywords',
      },
    );
    log('🎉 Vector data created in Supabase\n');
  } catch (error) {
    log('❌ Error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  log('✅ Ingestion complete\n');
})();
