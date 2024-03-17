import type { NextApiRequest, NextApiResponse } from 'next';
import { onlyContract_ABI, onlyContract_ADDRESS } from '../../constants/contracts';
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrumSepolia } from 'viem/chains'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
        const account = privateKeyToAccount('0x' + process.env.PRIVATE_KEY as any) 
        const client = createWalletClient({
            account,
            chain: arbitrumSepolia,
            transport: http()
        })

        const transactionHash = await client.writeContract({
            address: onlyContract_ADDRESS,
            abi: onlyContract_ABI,
            functionName: 'transfer',
            args: [req.body.address, '6900000000000000000'],
            // args: ['0x7A33615d12A12f58b25c653dc5E44188D44f6898', '6900000000000000000'],
            account,
            chain: undefined
        })

        console.log(transactionHash)

      res.status(200).json({ message: 'Transfer successful', transactionHash: transactionHash });
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
