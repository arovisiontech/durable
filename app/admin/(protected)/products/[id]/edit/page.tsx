import { fetchProductByIdAction } from '@/app/admin/actions/products'
import { ProductForm } from '@/src/components/admin/products/ProductForm'
import { notFound } from 'next/navigation'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const res = await fetchProductByIdAction(id)

  if (!res.product) {
    notFound()
  }

  return <ProductForm productToEdit={res.product} />
}
