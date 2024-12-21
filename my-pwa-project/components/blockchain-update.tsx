import React, { useState } from 'react';
import { useVeChainAccount } from '@/lib/useVeChainAccount';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clauseBuilder, FunctionFragment } from '@vechain/sdk-core';

const BlockchainUpdate = () => {
  const { thor, sendTransaction, accountFactory } = useVeChainAccount();
  
  // Farm States
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmCertifications, setFarmCertifications] = useState('');
  
  // Product States
  const [farmId, setFarmId] = useState('');
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [productCertifications, setProductCertifications] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const FARM_REGISTRY_ADDRESS = "0xF170bd1C9c77173D8f64A1f8679834fB2B9Da2a0";
  const PRODUCT_REGISTRY_ADDRESS = "0xf82A60FdaF07B7D29895c65305f0fB4d2295ea79";

  const registerFarm = async () => {
    if (!accountFactory) {
      alert('Please connect your VeChain wallet first');
      return;
    }

    try {
      const certifications = farmCertifications.split(',').map(cert => cert.trim());
      
      await sendTransaction({
        to: FARM_REGISTRY_ADDRESS,
        value: 0,
        data: {
          abi: [{
            name: 'registerFarm',
            type: 'function',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'name', type: 'string' },
              { name: 'location', type: 'string' },
              { name: 'certifications', type: 'string[]' }
            ],
            outputs: [{ type: 'uint256' }]
          }],
          functionName: 'registerFarm',
          args: [accountFactory, farmName, farmLocation, certifications] 
        }
      });

      setFarmName('');
      setFarmLocation('');
      setFarmCertifications('');
      
      alert('Farm registered successfully!');
    } catch (error) {
      console.error('Error registering farm:', error);
      alert('Error registering farm');
    }
  };

  const createProduct = async () => {
    if (!accountFactory) {
      alert('Please connect your VeChain wallet first');
      return;
    }

    try {
      const certifications = productCertifications.split(',').map(cert => cert.trim());
      
      const productBatch = {
        farmId: BigInt(farmId),
        productType,
        quantity: BigInt(quantity),
        unit,
        harvestDate: BigInt(new Date(harvestDate).getTime() / 1000),
        certifications,
        additionalInfo,
        status: 0, 
        supplyChainActors: []
      };

      await sendTransaction({
        to: PRODUCT_REGISTRY_ADDRESS,
        data: {
          abi: [{
            name: 'createProductBatch',
            type: 'function',
            inputs: [{
              name: 'batch',
              type: 'tuple',
              components: [
                { name: 'farmId', type: 'uint256' },
                { name: 'productType', type: 'string' },
                { name: 'quantity', type: 'uint256' },
                { name: 'unit', type: 'string' },
                { name: 'harvestDate', type: 'uint256' },
                { name: 'certifications', type: 'string[]' },
                { name: 'additionalInfo', type: 'string' },
                { name: 'status', type: 'uint8' },
                { name: 'supplyChainActors', type: 'address[]' }
              ]
            }],
            outputs: [{ type: 'uint256' }]
          }],
          functionName: 'createProductBatch',
          args: [productBatch]
        }
      });

      // Clear form
      setFarmId('');
      setProductType('');
      setQuantity('');
      setUnit('');
      setHarvestDate('');
      setProductCertifications('');
      setAdditionalInfo('');
      
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {!accountFactory && (
        <div className="text-center p-4 bg-yellow-100 rounded-lg mb-4">
          Please connect your VeChain wallet to continue
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Register Farm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Enter farm name"
              />
            </div>
            <div>
              <Label htmlFor="farmLocation">Location</Label>
              <Input
                id="farmLocation"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="Enter farm location"
              />
            </div>
            <div>
              <Label htmlFor="farmCertifications">Certifications (comma-separated)</Label>
              <Input
                id="farmCertifications"
                value={farmCertifications}
                onChange={(e) => setFarmCertifications(e.target.value)}
                placeholder="Organic, Non-GMO, etc."
              />
            </div>
            <Button onClick={registerFarm} disabled={!accountFactory}>Register Farm</Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="farmId">Farm ID</Label>
              <Input
                id="farmId"
                type="number"
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                placeholder="Enter farm ID"
              />
            </div>
            <div>
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="Enter product type"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg, liters, etc."
              />
            </div>
            <div>
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="productCertifications">Certifications (comma-separated)</Label>
              <Input
                id="productCertifications"
                value={productCertifications}
                onChange={(e) => setProductCertifications(e.target.value)}
                placeholder="Organic, Non-GMO, etc."
              />
            </div>
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Input
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any additional information"
              />
            </div>
            <Button onClick={createProduct} disabled={!accountFactory}>Create Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainUpdate;