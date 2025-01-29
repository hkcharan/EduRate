import React from 'react'

const Footer = () => {
  return (
    <div className=''>
       <footer className="bg-gray-100 text-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-600">About Us</a></li>
                <li><a href="#" className="hover:text-green-600">Careers</a></li>
                <li><a href="#" className="hover:text-green-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Learn More</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-600">Blog</a></li>
                <li><a href="#" className="hover:text-green-600">Help Center</a></li>
                <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-600">Terms of Use</a></li>
                <li><a href="#" className="hover:text-green-600">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-600">Instagram</a></li>
                <li><a href="#" className="hover:text-green-600">Facebook</a></li>
                <li><a href="#" className="hover:text-green-600">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} EduRate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
