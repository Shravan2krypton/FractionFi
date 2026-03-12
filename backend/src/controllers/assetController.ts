import { Request, Response } from 'express';
import { AssetModel } from '../models/Asset';
import { AuthRequest } from '../middleware/auth';

export const getAllAssets = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    let assets;
    if (type) {
      assets = await AssetModel.findByType(type as string);
    } else {
      assets = await AssetModel.findAll();
    }

    res.json({
      assets,
      count: assets.length
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const asset = await AssetModel.findById(parseInt(id as string));
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ asset });
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { name, asset_type, total_value, total_supply, description, image_url, roi_estimate } = req.body;

    // Validate input
    if (!name || !asset_type || !total_value || !total_supply) {
      return res.status(400).json({ error: 'Name, asset type, total value, and total supply are required' });
    }

    // Validate asset type
    const validTypes = ['real_estate', 'gold', 'startup'];
    if (!validTypes.includes(asset_type)) {
      return res.status(400).json({ error: 'Invalid asset type' });
    }

    const asset = await AssetModel.create({
      name,
      asset_type,
      total_value: parseFloat(total_value),
      total_supply: parseInt(total_supply),
      description,
      image_url,
      roi_estimate: roi_estimate ? parseFloat(roi_estimate) : undefined
    });

    res.status(201).json({
      message: 'Asset created successfully',
      asset
    });
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAssetContract = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { contract_address, blockchain_asset_id } = req.body;

    if (!contract_address || !blockchain_asset_id) {
      return res.status(400).json({ error: 'Contract address and blockchain asset ID are required' });
    }

    const asset = await AssetModel.updateContractAddress(
      parseInt(id as string),
      contract_address,
      parseInt(blockchain_asset_id)
    );

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({
      message: 'Asset contract information updated successfully',
      asset
    });
  } catch (error) {
    console.error('Update asset contract error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deactivateAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const asset = await AssetModel.deactivate(parseInt(id as string));

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({
      message: 'Asset deactivated successfully',
      asset
    });
  } catch (error) {
    console.error('Deactivate asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
