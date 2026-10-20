// Common component for remaining AI tools - Individual pages can be created later
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router';
import { Navigation } from '../../components/Navigation';
import { ArrowLeft, Construction } from 'lucide-react';

interface AIToolCommonProps {
  title: string;
  description: string;
  icon: React.ElementType;
  bgGradient: string;
  features: string[];
}

export default function AIToolCommon({ title, description, icon: Icon, bgGradient, features }: AIToolCommonProps) {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-6 lg:ml-64`}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/ai-tools')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Tools
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${bgGradient.replace('from-', 'from-').replace('to-', 'to-').replace(/50/g, '500')} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="w-5 h-5" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Icon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                
                <div className="max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-3">Planned Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                          ✓
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => navigate('/ai-tools')}
                >
                  Explore Other AI Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
