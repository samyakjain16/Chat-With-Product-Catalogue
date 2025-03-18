'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/breadcrumb';
import { DatabaseSetup } from '../setup/database_setup';
import { FieldMapping } from '../setup/field_mapping';
import { TestQueries } from '../setup/test_query';
import { Database, Cog, Search } from 'lucide-react';

type SetupStep = 'database' | 'configure' | 'test';

interface StepConfig {
  id: SetupStep;
  title: string;
  icon: React.ReactNode;
}

export default function TemplateSetup() {
  const params = useParams(); // Retrieve dynamic route params
  const rawTemplateId = params?.templateId; // Get raw templateId (string | string[] | undefined)
  const templateId = Array.isArray(rawTemplateId) ? rawTemplateId[0] : rawTemplateId || 'Unknown'; // Ensure it's a string

  const [currentStep, setCurrentStep] = useState<SetupStep>('database');
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [fieldMappings, setFieldMappings] = useState<any>(null);

  const steps: StepConfig[] = [
    { id: 'database', title: 'Select Database', icon: <Database className="w-5 h-5" /> },
    { id: 'configure', title: 'Configure Options', icon: <Cog className="w-5 h-5" /> },
    { id: 'test', title: 'Test Queries', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Template', href: '/template' },
          { label: `Setting up: ${templateId} Template`, href: '#' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Setting up: {templateId.charAt(0).toUpperCase() + templateId.slice(1)} Catalogue
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-center items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                  rounded-full p-3 flex items-center justify-center
                  ${currentStep === step.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}
                `}
              >
                {step.icon}
              </div>
              {index < steps.length - 1 && <div className="w-24 h-1 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex gap-[72px]">
            {steps.map((step) => (
              <span
                key={step.id}
                className={`text-sm ${
                  currentStep === step.id ? 'text-blue-500 font-medium' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto">
        {currentStep === 'database' && (
          <DatabaseSetup
            onComplete={(details) => {
              setConnectionDetails(details);
              setCurrentStep('configure');
            }}
          />
        )}

        {currentStep === 'configure' && connectionDetails && (
          <FieldMapping
            connectionDetails={connectionDetails}
            onComplete={(mappings) => {
              setFieldMappings(mappings);
              setCurrentStep('test');
            }}
          />
        )}

        {currentStep === 'test' && connectionDetails && fieldMappings && (
          <TestQueries connectionDetails={connectionDetails} fieldMappings={fieldMappings} />
        )}
      </div>
    </div>
  );
}
