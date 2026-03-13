import { pool } from '../config/database';

export interface Asset {
  id?: number;
  name: string;
  asset_type: 'real_estate' | 'gold' | 'startup';
  total_value: number;
  total_supply: number;
  token_price: number;
  available_tokens: number;
  roi_estimate?: number;
  description?: string;
  image_url?: string;
  contract_address?: string;
  blockchain_asset_id?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateAssetRequest {
  name: string;
  asset_type: 'real_estate' | 'gold' | 'startup';
  total_value: number;
  total_supply: number;
  description?: string;
  image_url?: string;
  roi_estimate?: number;
}

export class AssetModel {
  static async create(assetData: CreateAssetRequest): Promise<Asset> {
    const tokenPrice = assetData.total_value / assetData.total_supply;
    
    const query = `
      INSERT INTO assets (
        name, asset_type, total_value, total_supply, 
        token_price, available_tokens, description, 
        image_url, roi_estimate
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      assetData.name,
      assetData.asset_type,
      assetData.total_value,
      assetData.total_supply,
      tokenPrice,
      assetData.total_supply, // Initially all tokens are available
      assetData.description || null,
      assetData.image_url || null,
      assetData.roi_estimate || null
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(activeOnly: boolean = true): Promise<Asset[]> {
    let query = 'SELECT * FROM assets';
    const params: any[] = [];
    
    if (activeOnly) {
      query += ' WHERE is_active = true';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id: number): Promise<Asset | null> {
    const query = 'SELECT * FROM assets WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByType(assetType: string): Promise<Asset[]> {
    const query = 'SELECT * FROM assets WHERE asset_type = $1 AND is_active = true ORDER BY created_at DESC';
    const result = await pool.query(query, [assetType]);
    return result.rows;
  }

  static async updateAvailableTokens(assetId: number, tokensSold: number): Promise<Asset | null> {
    const query = `
      UPDATE assets 
      SET available_tokens = available_tokens - $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND available_tokens >= $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [tokensSold, assetId]);
    return result.rows[0] || null;
  }

  static async updateContractAddress(assetId: number, contractAddress: string, blockchainAssetId: number): Promise<Asset | null> {
    const query = `
      UPDATE assets 
      SET contract_address = $1, blockchain_asset_id = $2, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [contractAddress, blockchainAssetId, assetId]);
    return result.rows[0] || null;
  }

  static async deactivate(assetId: number): Promise<Asset | null> {
    const query = `
      UPDATE assets 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [assetId]);
    return result.rows[0] || null;
  }
}
