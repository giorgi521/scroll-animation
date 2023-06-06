import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(() => {
        material.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const textureLoader = new THREE.TextureLoader()
const texture =textureLoader.load('/textures/gradients/3.jpg')

// Scene
const scene = new THREE.Scene()

//particles 
const particles = {
    count: 7000,
    size: 0.02 ,
}

const particlesGeometry= new THREE.BufferGeometry()

const position = new Float32Array(particles.count * 3)

for (let i = 0; i < particles.count; i++) {

    position[i] = (Math.random() - 0.5) * 40

}
const particlesMaterial = new THREE.PointsMaterial({
   size: particles.size,
   sizeAttenuation: true,
   depthWrite: false,
   blending: THREE.AdditiveBlending,
})

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesMesh)


const material = new THREE.MeshToonMaterial({
     color: parameters.materialColor ,
     gradientMap: texture,
    })
const objectDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh2.position.y = -objectDistance * 1
mesh3.position.y = -objectDistance * 2

mesh1.position.x = 1.8
mesh2.position.x = -1.5
mesh3.position.x = 1.5

scene.add(mesh1, mesh2, mesh3)

const sectionMesh = [mesh1, mesh2, mesh3]

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const groupe = new THREE.Group()
scene.add(groupe)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
groupe.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//scroll
const scroll = window.scrollY
const currentSection = 0

window.addEventListener('scroll', () => {

    const scroll = window.scrollY
    const newSection = Math.round(scroll / sizes.height)

    if (newSection !== currentScroll) {
        currentSection = newSection

       gsap.to(
        sectionMesh[currentSection].rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=6'
        }
       )
    }

})

//cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    camera.position.y = -scrollY / sizes.height * objectDistance
    
    groupe.position.x += (cursor.x  - groupe.position.x) * 5 * deltaTime
    groupe.position.y += (-cursor.y - groupe.position.y) * 5 * deltaTime
    // camera.lookAt(mesh1)

   sectionMesh.forEach((mesh)=> {
        mesh.rotation.y += deltaTime * 1.2
   })

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()